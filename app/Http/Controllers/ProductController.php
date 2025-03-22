<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Imports\ProductsImport;
use App\Models\ExchangeRate;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
     /**
     * Получение всех продуктов.
     */
    public function index()
    {
        // Получаем все продукты из базы
        $products = Product::all();

        // Возвращаем данные в виде JSON
        return response()->json($products);
    }
    /**
     * Добавление новой продукции.
     */
    public function store(Request $request)
    {
        // Валидация входных данных
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'factory_price' => 'required|numeric|min:0',
            'markup_percentage' => 'required|numeric|min:0',
            'agent_bonus' => 'required|numeric|min:0',
        ]);

        // Создание продукции
        $product = Product::create($validatedData);

        return response()->json([
            'message' => 'Продукция успешно добавлена!',
            'product' => $product,
        ], 201);
    }

    /**
     * Изменение данных продукции.
     */
    public function update(Request $request, $id)
    {
        // Поиск продукции по ID
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Продукция не найдена.',
            ], 404);
        }

        // Валидация входных данных
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'factory_price' => 'sometimes|required|numeric|min:0',
            'markup_percentage' => 'sometimes|required|numeric|min:0',
            'agent_bonus' => 'sometimes|required|numeric|min:0',
        ]);

        // Обновление данных продукции
        $product->update($validatedData);

        return response()->json([
            'message' => 'Продукция успешно обновлена!',
            'product' => $product,
        ]);
    }

    /**
     * Удаление продукции.
     */
    public function destroy($id)
    {
        // Поиск продукции по ID
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Продукция не найдена.',
            ], 404);
        }

        // Удаление продукции
        $product->delete();

        return response()->json([
            'message' => 'Продукция успешно удалена!',
        ]);
    }

    /**
     * Загрузка Excel-файла и импорт продуктов.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv', // Ограничение на тип файла
        ]);

        try {
            Excel::import(new ProductsImport, $request->file('file'));

            return response()->json(['message' => 'Продукты успешно импортированы!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ошибка при импорте: ' . $e->getMessage()], 500);
        }
    }

     /**
     * Вывод продукции и цен.
     */
    public function price()
    {
       
        // Получаем актуальные курсы валют
        $baseCurrencyRate = ExchangeRate::where('currency_code', 'USD')
            ->orderBy('date', 'desc')
            ->value('final_rate') ?? 1;


        // Получаем список всех продуктов
        $products = Product::all()->map(function ($product) use ($baseCurrencyRate) {
            // Рассчитываем цену в базовой валюте
            $priceBaseCurrency = round($product->factory_price
                + ($product->factory_price * $product->markup_percentage / 100)
                + ($product->factory_price * $product->agent_bonus / 100),2);

            // Рассчитываем цену в иностранной валюте
            $priceForeignCurrency = round($priceBaseCurrency *  $baseCurrencyRate,2);

            return [
                'id' => $product->id,
                'name' => $product->name,
                'price_USD_currency' => round($priceBaseCurrency, 2), // Цена в базовой валюте
                'price_KZT_currency' => round($priceForeignCurrency, 2), // Цена в иностранной валюте
            ];
        });

        return response()->json($products);
    }
}
