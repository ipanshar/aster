<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Обновление структуры таблицы.
     */
    public function up()
    {
        Schema::table('exchange_rates', function (Blueprint $table) {
            $table->double('markup_percentage', 5, 2)->default(0); // Процент наценки
            $table->double('final_rate', 15, 8)->nullable(); // Итоговый курс с наценкой
        });
    }

    /**
     * Откат изменений.
     */
    public function down()
    {
        Schema::table('exchange_rates', function (Blueprint $table) {
            $table->dropColumn(['markup_percentage', 'final_rate']);
        });
    }
};
