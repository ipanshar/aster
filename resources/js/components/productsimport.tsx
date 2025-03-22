import React, { useState } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

const ImportProducts: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Пожалуйста, выберите файл!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/products/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
        } catch (error) {
            alert('Ошибка при загрузке файла');
            console.error(error);
        }
    };

    return (
        <div>
            <div><Label>В Excel должны содержать столбцы: name, factory_price_usd, markup_percentage, agent_bonus</Label></div>
        <div style={{ display: 'flex'}}>
            <div style={{margin:'5px'}}> 
                <Input type="file" accept=".xls,.xlsx,.csv" onChange={handleFileChange}  /></div>
            <div style={{margin:'5px'}}> <Button onClick={handleUpload} >Загрузить файл</Button></div>
        </div>
        </div>
    );
};

export default ImportProducts;
