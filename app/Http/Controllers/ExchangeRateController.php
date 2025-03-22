<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExchangeRate;
use App\Models\Markup;
use Carbon\Carbon;

class ExchangeRateController extends Controller
{
    /**
     * Обновление курса валют USD с учетом наценки.
     */
    public function updateExchangeRate()
    {
        // URL для загрузки данных
        $url = 'https://nationalbank.kz/rss/rates_all.xml';

        try {
            // Загружаем XML
            $xml = simplexml_load_file($url);

            foreach ($xml->channel->item as $item) {
                $currencyCode = (string) $item->title; // Код валюты
                if ($currencyCode !== 'USD') {
                    continue; // Пропускаем всё, кроме USD
                }

                $rate = (float) str_replace(',', '.', (string) $item->description); // Текущий курс
                $pubDate = Carbon::parse((string) $item->pubDate)->format('Y-m-d'); // Дата

                // Получаем процент наценки из таблицы Markup
                $markup = Markup::latest()->first();
                $markupPercentage = $markup ? $markup->markup_percentage : 0;

                // Рассчитываем итоговый курс с учетом наценки
                $finalRate = $rate + ($rate * $markupPercentage / 100);

                // Обновляем или создаем запись в таблице ExchangeRate
                ExchangeRate::updateOrCreate(
                    ['currency_code' => $currencyCode, 'date' => $pubDate],
                    [
                        'rate' => $rate,
                        'markup_percentage' => $markupPercentage,
                        'final_rate' => $finalRate,
                    ]
                );
            }

            return response()->json(['message' => 'Курс USD успешно обновлен!']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ошибка обновления курса: ' . $e->getMessage()], 500);
        }
    }

      /**
     * Ручное изменение курсов валют.
     */
    public function updateExchangeRateRoute(Request $request, $id)
    {
        // Валидация входных данных
        $validatedData = $request->validate([
            'rate' => 'required|numeric|min:0', // Новый курс валюты
            'markup_percentage' => 'nullable|numeric|min:0|max:100', // Новая наценка (опционально)
        ]);

        // Поиск курса валюты
        $exchangeRate = ExchangeRate::find($id);
        if (!$exchangeRate) {
            return response()->json(['message' => 'Курс валюты не найден.'], 404);
        }

        // Обновляем курс валюты
        $exchangeRate->rate = $validatedData['rate'];
        $exchangeRate->markup_percentage = $validatedData['markup_percentage'];

        // Если передан новый процент наценки, обновляем его
 
            $markup = Markup::latest()->first();
            if ($markup) {
                $markup->markup_percentage = $validatedData['markup_percentage'];
                $markup->save();
            } else {
                // Если записи нет, создаём новую
                $markup = Markup::create(['markup_percentage' => $validatedData['markup_percentage']]);
            }

            // Пересчитываем итоговый курс с учётом новой наценки
            $exchangeRate->final_rate = $exchangeRate->rate + ($exchangeRate->rate * $exchangeRate->markup_percentage / 100);

        // Сохраняем изменения
        $exchangeRate->save();

        return response()->json([
            'message' => 'Курс валюты успешно обновлён!',
            'exchange_rate' => $exchangeRate,
        ]);
    }

    /**
     * Вывод всех последних курсов валют.
     */
    public function getLatestExchangeRates()
    {
        // Получаем последние записи для каждой валюты
        $latestExchangeRates = ExchangeRate::select('id', 'currency_code', 'rate', 'markup_percentage', 'final_rate', 'date')
            ->whereIn('id', function ($query) {
                $query->selectRaw('MAX(id)')
                      ->from('exchange_rates')
                      ->groupBy('currency_code');
            })
            ->get();

        return response()->json($latestExchangeRates);
    }

    /**
     * Получение финального курса для указанной валюты.
     *
     * @param string $currencyCode
     * @return \Illuminate\Http\JsonResponse
     */
    public function getExchangeRate($currencyCode = 'USD')
    {
        // Получаем последний финальный курс для указанной валюты
        $rate = ExchangeRate::where('currency_code', strtoupper($currencyCode))
            ->orderBy('date', 'desc') // Сортировка по дате: самый новый курс
            ->value('final_rate');

        if (!$rate) {
            return response()->json(['error' => 'Курс для данной валюты не найден'], 404);
        }

        return response()->json([
            'currency' => strtoupper($currencyCode),
            'rate' => round($rate,2),
        ]);
    }
}
