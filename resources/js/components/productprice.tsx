import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Page, Text, View, Document, PDFDownloadLink, StyleSheet, Font, Image } from '@react-pdf/renderer';
import axios from 'axios';

// Регистрируем шрифт с поддержкой кириллицы
import RobotoRegular from '@/fonts/Roboto-Regular.ttf';

Font.register({
    family: 'Roboto',
    src: RobotoRegular,
});

// Интерфейс для описания продукта
interface Product {
    id: number;
    name: string;
    price_USD_currency: number;
    price_KZT_currency: number;
}

interface User {
    name: string;
    email: string;
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

// Компонент для PDF
const CommercialOfferPDF: React.FC<{ selectedProducts: Product[]; user: User }> = ({ selectedProducts, user }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Логотип */}
            <Image
                style={styles.logo}
                src="/aster-logo.png" // Путь к логотипу
            />
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
            {/* Подпись внизу */}
            <Text style={styles.footer}>
                Предложение подготовил: {user.name} {"("+user.email+")"}
            </Text>
        </Page>
    </Document>
);

const CommercialOffer: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [user, setUser] = useState<User>({ name: '', email: '' });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/products/price');
                setProducts(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        const fetchUser = async () => {
            try {
                const response = await axios.get('/profile/user');
                setUser({ name: response.data.name, email: response.data.email });
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
            }
        };

        fetchProducts();
        fetchUser();
    }, []);

    const filteredProducts = products.filter((product) => selectedProducts.includes(product.id));

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Название', width: 200 },
        { field: 'price_USD_currency', headerName: 'Цена (USD)', type: 'number', width: 150 },
        { field: 'price_KZT_currency', headerName: 'Цена (KZT)', type: 'number', width: 150 },
    ];

    return (
        <div style={{ width: '100%' }}>
            <div style={{ padding:'10px'}}>
            <h2>Список продукции</h2> {filteredProducts.length > 0 ? (
                <PDFDownloadLink
                    document={<CommercialOfferPDF selectedProducts={filteredProducts} user={user} />}
                    fileName="Commercial_Offer_Aster_Project.pdf"
                    style={{
                        textDecoration: 'none',
                        color: '#fff',
                        backgroundColor: 'green',
                        borderRadius: '5px',
                    }}
                >
                    {({ loading }) => (loading ? 'Генерация PDF...' : 'Скачать коммерческое предложение')}
                </PDFDownloadLink>
            ) : (
                <p style={{ marginLeft: '5px' }}>Выберите продукты для коммерческого предложения</p>
            )}
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
    );
};

export default CommercialOffer;
