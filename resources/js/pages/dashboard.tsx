import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useUser } from '@/components/UserContext';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Page, Text, View, Document, pdf, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Хлебные крошки
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Панель управления',
        href: '/dashboard',
    },
];

// Регистрируем шрифт с поддержкой кириллицы
import RobotoRegular from '@/fonts/Roboto-Regular.ttf';

Font.register({
    family: 'Roboto',
    src: RobotoRegular,
});

// Интерфейс для продуктов
interface Product {
    id: number;
    name: string;
    price_USD_currency: number;
    price_KZT_currency: number;
}

interface User {
    name: string;
    email?: string;
}

// Стили для PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: 'Roboto',
    },
    logo: {
        width: 135,
        height: 58,
        marginBottom: 20,
        alignSelf: 'center',
    },
    header: {
        fontSize: 18,
        fontWeight: 800,
        textAlign: 'center',
        marginBottom: 20,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    table: {
        marginVertical: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCol: {
        width: '25%',
        borderWidth: 1,
        borderColor: '#000',
        textAlign: 'right',
        padding: 5,
    },
    tableColID: {
        width: '10%',
        borderWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
        padding: 5,
    },
    tableColName: {
        width: '40%',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
    },
    footer: {
        marginTop: 20,
        textAlign: 'right',
        fontSize: 12,
    },
});

// Компонент PDF
const CommercialOfferPDF: React.FC<{ selectedProducts: Product[]; user: User; exchangeRateUSD: number }> = ({ selectedProducts, user, exchangeRateUSD }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Image style={styles.logo} src="/aster-logo.png" />
            <Text  style={styles.dateRow}>ТОО «Aster Project» («Астер Проджект»)Юридический адрес: г.Алматы, Наурызбайский район, ул. Кенесары Хана 54/20, офис 20ЖК «Хан Тенгри» , эл.адрес: info@aster-project.kzБИН 140640020043 в АО «Банк ЦентрКредит» БСКБИК (SWIFT) KCJBKZKX; ИИК KZ858562203116747548 (KZT); КБЕ 17</Text>
            <Text style={styles.header}>Коммерческое предложение</Text>
            <View style={styles.dateRow}>
                <Text>Дата: {new Date().toLocaleDateString()}</Text>
                <Text>Курс USD: {exchangeRateUSD}</Text>
            </View>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableColID, styles.tableHeader]}>ID</Text>
                    <Text style={[styles.tableColName, styles.tableHeader]}>Название</Text>
                    <Text style={[styles.tableCol, styles.tableHeader]}>Цена (USD)</Text>
                    <Text style={[styles.tableCol, styles.tableHeader]}>Цена (KZT)</Text>
                </View>
                {selectedProducts.map((product) => (
                    <View key={product.id} style={styles.tableRow}>
                        <Text style={styles.tableColID}>{product.id}</Text>
                        <Text style={styles.tableColName}>{product.name}</Text>
                        <Text style={styles.tableCol}>{product.price_USD_currency} USD</Text>
                        <Text style={styles.tableCol}>{product.price_KZT_currency} KZT</Text>
                    </View>
                ))}
            </View>
            <Text style={styles.footer}>
                Предложение подготовил: {user.name} {"(" + user.email + ")"}
            </Text>
        </Page>
    </Document>
);

// Главный компонент Dashboard
export default function Dashboard() {
    const { user, setUser } = useUser();
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [exchangeRateUSD, setExchangeRateUSD] = useState<number | null>(null);

    useEffect(() => {
        axios.get('/profile/user').then((response) => {
            setUser({
                id: response.data.id,
                name: response.data.name,
                roles: response.data.roles,
                avatar: response.data.avatar,
                email: response.data.email,
            });
        }).catch((error) => {
            console.error('Ошибка при получении данных пользователя:', error);
        });
    }, [setUser]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/products/price');
                setProducts(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        const fetchExchangeRateUSD = async () => {
            try {
                const response = await axios.get('/exchange-rate/USD');
                setExchangeRateUSD(response.data.rate);
            } catch (error) {
                console.error('Ошибка при получении курса USD:', error);
            }
        };

        fetchProducts();
        fetchExchangeRateUSD();
    }, []);

    const filteredProducts = products.filter((product) => selectedProducts.includes(product.id));

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Название', width: 200 },
        { field: 'price_USD_currency', headerName: 'Цена (USD)', type: 'number', width: 150 },
        { field: 'price_KZT_currency', headerName: 'Цена (KZT)', type: 'number', width: 150 },
    ];

    const handleDownload = async () => {
        if (!user || filteredProducts.length === 0 || !exchangeRateUSD) return;

        const blob = await pdf(
            <CommercialOfferPDF selectedProducts={filteredProducts} user={user} exchangeRateUSD={exchangeRateUSD} />
        ).toBlob();

        saveAs(blob, 'Commercial_Offer_Aster_Project.pdf');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Панель управления" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Отображение текущего курса USD */}
                <div className="flex justify-end items-center">
                    <p style={{ marginRight: '20px', fontSize: '16px', fontWeight: 'bold' }}>
                        Курс USD: {exchangeRateUSD ? `${exchangeRateUSD}` : 'Загрузка...'}
                    </p>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div style={{ width: '100%' }}>
                        <div style={{ padding: '10px' }}>
                            <h2>Список продукции</h2>
                            <button
                                onClick={handleDownload}
                                disabled={filteredProducts.length === 0 || !user || !exchangeRateUSD}
                                style={{
                                    textDecoration: 'none',
                                    color: '#fff',
                                    backgroundColor: filteredProducts.length > 0 && exchangeRateUSD ? 'green' : 'gray',
                                    borderRadius: '5px',
                                    cursor: filteredProducts.length > 0 && exchangeRateUSD ? 'pointer' : 'not-allowed',
                                    padding: '10px 20px',
                                }}
                            >
                                Скачать коммерческое предложение
                            </button>
                        </div>
                        <DataGrid
                            rows={products}
                            columns={columns}
                            checkboxSelection
                            onRowSelectionModelChange={(newSelection) =>
                                setSelectedProducts([...newSelection] as number[])
                            }
                            pageSizeOptions={[25, 50, 100]}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 25, page: 0 } },
                            }}
                            pagination
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
