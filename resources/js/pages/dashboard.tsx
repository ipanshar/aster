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
const CommercialOfferPDF: React.FC<{ selectedProducts: Product[]; user: User }> = ({ selectedProducts, user }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Image style={styles.logo} src="/aster-logo.png" />
            <Text style={styles.header}>Коммерческое предложение</Text>
            <Text>Дата: {new Date().toLocaleDateString()}</Text>
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

export default function Dashboard() {
    const { user, setUser } = useUser();
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

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
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => selectedProducts.includes(product.id));

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Название', width: 200 },
        { field: 'price_USD_currency', headerName: 'Цена (USD)', type: 'number', width: 150 },
        { field: 'price_KZT_currency', headerName: 'Цена (KZT)', type: 'number', width: 150 },
    ];

    const handleDownload = async () => {
        if (!user || filteredProducts.length === 0) return;

        const blob = await pdf(
            <CommercialOfferPDF selectedProducts={filteredProducts} user={user} />
        ).toBlob();

        saveAs(blob, 'Commercial_Offer_Aster_Project.pdf');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Панель управления" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div style={{ width: '100%' }}>
                        <div style={{ padding: '10px' }}>
                            <h2>Список продукции</h2>
                            <button
                                onClick={handleDownload}
                                disabled={filteredProducts.length === 0 || !user}
                                style={{
                                    textDecoration: 'none',
                                    color: '#fff',
                                    backgroundColor: filteredProducts.length > 0 ? 'green' : 'gray',
                                    borderRadius: '5px',
                                    cursor: filteredProducts.length > 0 ? 'pointer' : 'not-allowed',
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
