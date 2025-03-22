<?php

namespace App\Services;

use App\Models\ExchangeRate;
use App\Models\Markup;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CurrencyRateService
{
    /**
     * Загрузить и сохранить курс валюты USD с наценкой.
     */
    public function updateExchangeRate()
    {
        // URL на XML с курсами валют
        $url = 'https://nationalbank.kz/rss/rates_all.xml';

        try {
            // Загружаем XML
            $xml = simplexml_load_file($url);

            foreach ($xml->channel->item as $item) {
                // Извлечение данных
                $title = (string) $item->title; // Код валюты
                if ($title !== 'USD') {
                    continue; // Пропускаем все кроме USD
                }

                $description = (float) str_replace(',', '.', (string) $item->description); // Курс
                $pubDate = Carbon::parse((string) $item->pubDate)->format('Y-m-d'); // Дата курса

                // Получение текущего процента наценки из таблицы
                $markup = Markup::latest()->first(); // Берем последний установленный процент
                $markupPercentage = $markup ? $markup->markup_percentage : 0;

                // Расчет итогового курса с учетом наценки
                $finalRate = $description + ($description * $markupPercentage / 100);

                // Сохраняем или обновляем курс валюты
                ExchangeRate::updateOrCreate(
                    ['currency_code' => $title, 'date' => $pubDate],
                    [
                        'rate' => $description,
                        'markup_percentage' => $markupPercentage,
                        'final_rate' => $finalRate,
                    ]
                );
            }
        } catch (\Exception $e) {
            // Логирование ошибки
            Log::error('Ошибка обновления курса валют USD: ' . $e->getMessage());
        }
    }
}
