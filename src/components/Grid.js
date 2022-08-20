import { ImageList, ImageListItem, ImageListItemBar } from '@mui/material'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import Filter from './Filter'
import Sort from './Sort'

const Grid = () => {
    const productList = collection(db, 'products');
    const [products, setProducts] = useState([]);
    const [currentValue, setCurrentValue] = useState(0)

    const getProducts = async () => {
        let items = await getDocs(productList)
        updateProducts(items)
    };

    const updateProducts = items => {
        setProducts(items.docs.map(elm => {
            return {
                id:elm.id,
                ...elm.data()
            }
        }))
    }
    
    const sortProducts = async (order = 'asc') => {
        let ordering = orderBy('price', order)
        let q = query(productList, ordering)
        let items = await getDocs(q)
        updateProducts(items)
    }

    
    useEffect(() => {
        ( async () => {
            let condition = where('price','>=', currentValue)
            let q = query(productList, condition)
            let data = await getDocs(q)
            updateProducts(data)
        })()
    }, [currentValue])
    
    useEffect(() => {
        getProducts();
    }, []);

    return <div>
        <h3>Products {products.length}</h3>
        <Sort fn={sortProducts} />
        <Filter 
            currentValue={currentValue}
            onChange = {e => setCurrentValue(e.target.value)}
        />
        <ImageList sx={{width:500}}>
        {
            products.map(elm => (
                <ImageListItem key={elm.id}>
                    <img src={elm.photo} />
                    <ImageListItemBar
                        title={'$' + elm.price}
                        subtitle={elm.model}
                    />
                </ImageListItem>
            ))
        }
        </ImageList>
    </div>
};
export default Grid;
