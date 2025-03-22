import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowModesModel, GridRowModes, GridActionsCellItem } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import axios from 'axios';
import SettingsLayout from '@/layouts/settings/bookepinglayout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import '@/pages/css/all.css'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Курс валюты',
        href: '/rate',
    },
];

interface ExchangeRate {
    id: number;
    currency_code: string;
    rate: number;
    markup_percentage: number;
    final_rate: number;
    date: string;
}

export default function ExchangeRateManagement() {
    const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    // Загружаем актуальные курсы
    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get('/exchange_rates/latest');
            setExchangeRates(response.data);
        } catch (error) {
            console.error('Ошибка загрузки курсов:', error);
        }
    };

    // Обновляем курсы вручную
    const handleManualUpdate = async () => {
        try {
            await axios.get('/exchange_rates/update');
            alert('Курсы валют успешно обновлены!');
            fetchExchangeRates(); // Обновляем список курсов
        } catch (error) {
            console.error('Ошибка обновления курсов:', error);
            alert('Не удалось обновить курсы валют.');
        }
    };

    // Обработка обновления строки
    const handleProcessRowUpdate = async (updatedRow: ExchangeRate, originalRow: ExchangeRate) => {
        try {
            // Отправляем обновлённые данные на сервер
            await axios.put(`/exchange_rates/${updatedRow.id}`, updatedRow);

            fetchExchangeRates();
            alert('Курс успешно обновлён!');

            return updatedRow;
        } catch (error) {
            console.error('Ошибка сохранения курса:', error);
            alert('Не удалось сохранить изменения.');
            // Возвращаем оригинальные данные, если произошла ошибка
            return originalRow;
        }
    };

    // Установка режима редактирования
    const handleEditClick = (id: number) => {
        setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.Edit } }));
    };

    // Завершение редактирования
    const handleCancelClick = (id: number) => {
        setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.View } }));
    };

    useEffect(() => {
        fetchExchangeRates();
    }, []);

    const columns: GridColDef[] = [
        { field: 'currency_code', headerName: 'Код валюты', width: 150 },
        { field: 'rate', headerName: 'Курс', type: 'number', width: 150, editable: true },
        { field: 'markup_percentage', headerName: 'Наценка (%)', type: 'number', width: 150, editable: true },
        { field: 'final_rate', headerName: 'Итоговый курс', type: 'number', width: 150 },
        { field: 'date', headerName: 'Дата', width: 150 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Управление курсом валют" />
            <SettingsLayout>
                <div style={{ padding: '20px' }}>
                    <h2>Управление курсами валют</h2>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleManualUpdate}
                        style={{ marginBottom: '20px' }}
                    >
                        Получить курс nationalbank.kz
                    </Button>
                    <div className="dataGrid-container" style={{ height: 400 }}>
                        <DataGrid
                            rows={exchangeRates}
                            columns={columns}
                            editMode="row"
                            rowModesModel={rowModesModel}
                            onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
                            processRowUpdate={handleProcessRowUpdate} // Обработка обновления строки
                            getRowId={(row) => row.id} // Указываем идентификатор строки
                        />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
