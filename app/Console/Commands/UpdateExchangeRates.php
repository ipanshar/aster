<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\CurrencyRateService;

class UpdateExchangeRates extends Command
{
    /**
     * Название команды.
     */
    protected $signature = 'exchange_rates:update';

    /**
     * Описание команды.
     */
    protected $description = 'Обновление курсов валют из RSS источника';

    /**
     * Выполнение команды.
     */
    public function handle(CurrencyRateService $service)
    {
        $service->updateExchangeRate();
        $this->info('Курсы валют успешно обновлены!');
    }
}
