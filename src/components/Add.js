import { Button, TextField, LinearProgress } from '@mui/material';
import {useState, useRef} from 'react'
import {db, storage} from '../firebase-config';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {addDoc, collection } from 'firebase/firestore';

const Add = () => {

    const myPhotoRef = useRef()

    const productList = collection(db, "products");
    const [product, setProduct] = useState({price: '', model: ''});
    const [progress, setProgress] = useState(0)


    const handleSubmit = e => {
        e.preventDefault();
        const file = myPhotoRef.current.files[0]
        if(!file){
            return
        }
        const storageRef = ref(storage, `files/${Date.now() + file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on("state_changed", (data) => {
            console.log("on process...")
            console.log(data.bytesTransferred/data.totalBytes)
            setProgress(Math.round((data.bytesTransferred/data.totalBytes)*100))
        },
        (error) => {
            console.log("something wen’t wrong", error)
        },
        () => {
            console.log("file uploaded successfully....")

            getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
                await addDoc(productList, {...product, photo:downloadURL})
                setProduct({model:"", price:""})
                setProgress(0)
                myPhotoRef.current.value=null
            });
        })
    }

    return (
        <div>
            <h3>Add Product</h3>
            {
                progress > 0
                &&
                <div>
                    <LinearProgress variant="indeterminate" value={progress}/>
                    <p>{progress}%</p>
                </div>
            }
            <form onSubmit={handleSubmit}>
                <div className="box">
                    <TextField 
                        label="model" 
                        type="text" 
                        required 
                        value = {product.model}
                        onChange = {e => setProduct({...product, model:e.target.value})}
                    />
                </div>
                <div className="box">
                    <TextField 
                        label="price"
                        type="number" 
                        required 
                        value = {product.price}
                        onChange = {e => setProduct({...product, price: +e.target.value})}
                    />
                </div>
                <div className="box">
                    <input type="file" ref = {myPhotoRef} />
                </div>
                <div className="box">
                    <Button type="submit">save</Button>
                </div>
        </form>
        </div>
    );
};

export default Add;
