<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Запуск миграции.
     */
    public function up()
    {
        Schema::create('exchange_rates', function (Blueprint $table) {
            $table->id(); // Уникальный идентификатор
            $table->string('currency_code'); // Код валюты, например USD, EUR
            $table->double('rate', 15, 8); // Курс валюты с высокой точностью
            $table->date('date'); // Дата, к которой относится курс
            $table->timestamps();

            // Уникальность: один курс для одной валюты на одну дату
            $table->unique(['currency_code', 'date']);
        });
    }

    /**
     * Откат миграции.
     */
    public function down()
    {
        Schema::dropIfExists('exchange_rates');
    }
};
