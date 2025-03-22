import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowEditStopReasons } from '@mui/x-data-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/bookepinglayout';
import { Head } from '@inertiajs/react';
import '@/pages/css/all.css'
import ImportProducts from '@/components/productsimport';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Управление продукцией',
        href: '/productsmanagment',
    },
];

interface Product {
    id: number;
    name: string;
    factory_price: number; // Теперь тип number
    markup_percentage: number; // Теперь тип number
    agent_bonus: number; // Теперь тип number
}

export default function ProductsManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<Product>({
        id: 0,
        name: '',
        factory_price: 0.0, 
        markup_percentage: 0.0,
        agent_bonus: 0.0,
    });
    const getAllproducts = () => {
        axios
            .get('/products')
            .then((response) => setProducts(response.data))
            .catch((error) => console.error('Ошибка при загрузке продуктов:', error));
    }
    useEffect(() => {
        getAllproducts();
    }, []);

    const addProduct = () => {
        if (!newProduct.name.trim() || newProduct.factory_price <= 0) {
            alert('Введите корректные данные для нового продукта!');
            return;
        }

        axios
            .post('/products', newProduct)
            .then((response) => {
                alert(response.data.message);
                getAllproducts();
                setNewProduct({ id: 0, name: '', factory_price: 0.0, markup_percentage: 0.0, agent_bonus: 0.0 });
            })
            .catch((error) => console.error('Ошибка при добавлении продукта:', error));
    };

    const deleteProduct = (id: number) => {
        axios
            .delete(`/products/${id}`)
            .then(() => {
                setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
            })
            .catch((error) => console.error('Ошибка при удалении продукта:', error));
    };

    const updateProduct = (updatedProduct: Product) => {
        axios
            .put(`/products/${updatedProduct.id}`, updatedProduct)
            .then(() => {
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === updatedProduct.id ? updatedProduct : product
                    )
                );
            })
            .catch((error) => console.error('Ошибка при редактировании продукта:', error));
    };

    const productColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Наименование', width: 200, editable: true },
        { field: 'factory_price', headerName: 'Цена завода', type: 'number', width: 150, editable: true },
        { field: 'markup_percentage', headerName: 'Наценка (%)', type: 'number', width: 150, editable: true },
        { field: 'agent_bonus', headerName: 'Бонус агенту', type: 'number', width: 150, editable: true },
        {
            field: 'actions',
            headerName: 'Действия',
            width: 150,
            renderCell: (params) => (
                <Button
                    style={{ backgroundColor: 'red', color: 'white' }}
                    onClick={() => deleteProduct(params.id as number)}
                >
                    Удалить
                </Button>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Управление продукцией" />
        <SettingsLayout>
            <div style={{ }}>
                <h2>Управление продукцией</h2>

                <div className="inputs-container">
                    <Input
                        type="text"
                        placeholder="Наименование"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <Input
                        type="number"
                        placeholder="Цена завода"
                        value={newProduct.factory_price}
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, factory_price: parseFloat(e.target.value) })
                        }
                        step="0.01"
                    />
                    <Input
                        type="number"
                        placeholder="Наценка (%)"
                        value={newProduct.markup_percentage}
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, markup_percentage: parseFloat(e.target.value) })
                        }
                        step="0.01"
                    />
                    <Input
                        type="number"
                        placeholder="Бонус агенту"
                        value={newProduct.agent_bonus}
                        onChange={(e) =>
                            setNewProduct({ ...newProduct, agent_bonus: parseFloat(e.target.value) })
                        }
                        step="0.01"
                    />
                    <Button onClick={addProduct}>Добавить продукт</Button>
                </div>
                <div>
                    <ImportProducts/>
                </div>
                <div   className="dataGrid-container" style={{ height: 400 }} >
                    <DataGrid
                        rows={products}
                        columns={productColumns}
                        pageSizeOptions={[25, 50, 100]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 25, page: 0 } },
                        }}
                        pagination
                        processRowUpdate={(updatedRow) => {
                            updateProduct(updatedRow as Product);
                            return updatedRow;
                        }}
                    />
                </div>
            </div>
        </SettingsLayout>
    </AppLayout>
    );
}
