import React, { useEffect, useState } from 'react'


import axios from "axios"
import { Select } from "antd"
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminMenu from '../../components/Layout/AdminMenu';
import Sidebar from '../../components/Sidebar/Sidebar';

const {Option} = Select



const UpdatePlace = ({sidebar}) => {

  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  

  const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState("");

  const [id, setId] = useState("");


  //GET SINGLE PRODUCT
  const getSingleProduct = async()=>{
    try {
      const {data} = await axios.get(`http://localhost:8000/api/v1/place/get-place/${params.slug}`)
      setName(data.product.name)
      setId(data.product._id)
      setDescription(data.product.description)
      
      setCategory(data.product.category._id)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    getSingleProduct();
  }, [])

//GET ALL CATEGORY
const getAllCategory = async() => {
    
  try {
      const {data} = await axios.get("http://localhost:8000/api/v1/category/get-category");
      if(data?.success){
        setCategories(data?.category);
      }

  } catch (error) {
    console.log(error);
    toast.error("Something went wrong in getting category");
  }
};

useEffect(()=>{
  getAllCategory();
}, [])



// handlesubmit update product
const handleUpdate = async(e) => {
e.preventDefault();

try {
  const productData = new FormData()
  productData.append("category", category)
  productData.append("name", name)
  productData.append("description", description)
 
  photo && productData.append("photo", photo)


  const {data} = await axios.put(`http://localhost:8000/api/v1/place/update-place/${id}`, productData)
  if(data?.success){
    toast.success("Place Updated Successfully");
    
  }else{
    toast.error("Failed to Update Place");
  }
} catch (error) {
  console.log(error);
  toast.error("Error in updating product");
}
};

// handleDelete DELETE product
const handleDelete = async() =>{
  try {
    let answer = window.prompt("Are you sure want to delete Place ?");
    if(!answer) return;
    const {data} = await axios.delete(`http://localhost:8000/api/v1/place/delete-place/${id}`);
    toast.success("Place Deleted Success");
    navigate("/dashboard/admin/places");
  } catch (error) {
    console.log(error);
    toast.error("Error while deleting place");
  }
};

  return (
    <>
    <Sidebar sidebar={sidebar}/>
      <div className="container container-fluid m-3 p-3">
    <div className="row">
        <div className="col-md-3">
            <AdminMenu/>
        </div>
        <div className="col-md-9">
          <h1>Update Place</h1>
          <div className="m-1 w-75">
            <Select bordered={false} placeholder="select a category" size='large' showSearch className='form-select mb-3' onChange={(value)=> {setCategory(value)} }
            value={category}
            >
              {categories?.map(c => (
                <Option key={c._id} value={c._id}>{c.name}</Option>
              ))}

            </Select>

                {/* UPLOAD IMAGE */}

            <div className="mb-3 ">
              <label className='btn btn-outline-secondary col-md-12'>
                {photo? photo.name : "Upload Image"}
                <input type="file" name='photo' accept='image/*'
                onChange={(e) => setPhoto(e.target.files[0])}
                hidden />
              </label>
            </div>

                {/* IMAGE PREVIEW */}
            <div className="mb-3">
              {photo ? (
                <div className="text-center">
                  <img src={URL.createObjectURL(photo)} alt="photo to upload" height={"200px"} className='img img-responsive'/>
                </div>
              ) : (
                <div className="text-center">
                  <img src={`http://localhost:8000/api/v1/place/place-photo/${id}`} alt="photo to upload" height={"200px"} className='img img-responsive'/>
                </div>
              )}
            </div>

            <div className="mb-3">
              <input type="text" value={name} placeholder='Write a name' className='form-control' onChange={(e)=> setName(e.target.value)} />
            </div>

            <div className="mb-3">
              <textarea cols="30" rows="4" value={description} placeholder='description' className='form-control' onChange={(e)=> setDescription(e.target.value)}></textarea>
            </div>

      

            <div className="mb-3">
              <button className='btn btn-primary' onClick={handleUpdate}>UPDATE PLACE</button>
            </div>

            <div className="mb-3">
              <button className='btn btn-danger' onClick={handleDelete}>DELETE PLACE</button>
            </div>

          </div>
        </div>
    </div>
    </div>
</>
  )
}

export default UpdatePlace