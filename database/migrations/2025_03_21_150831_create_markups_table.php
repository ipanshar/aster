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
        Schema::create('markups', function (Blueprint $table) {
            $table->id(); // Уникальный идентификатор
            $table->double('markup_percentage', 5, 2); // Процент наценки
            $table->timestamps();
        });
    }

    /**
     * Откат миграции.
     */
    public function down()
    {
        Schema::dropIfExists('markups');
    }
};
