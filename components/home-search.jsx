"use client";

import React, { use, useState } from 'react'
import { Input } from './ui/input';
import { Camera, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleTextSubmit = (e) => {};
  const handleImageSearch = (e) => {};

   const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if(file.size > 5 * 1024 * 1024){
        toast.error("File size exceeds 5MB limit");
        return;
      }
      setIsUploading(true);
      setSearchImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("Image uploaded successfully");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Error reading file");
      };

      reader.readAsDataURL(file);
    }
  }
   const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({
    onDrop,
    accept:{
      "iamge/*": [".jpeg", ".jpg", ".png"]
    },
    maxFiles: 1,
  })

  return (
    <div>
      <form onSubmit={handleTextSubmit}>
        <div className='relative flex items-center'>
          <Input type="text"
          placeholder="Enter brand, model, or use our AI Image Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-12 py-6 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm text-gray-900 placeholder:text-gray-500"
          />

            <div className="absolute right-[100px]">
            <Camera
  size={35}
  onClick={() => setIsImageSearchActive(!isImageSearchActive)}
  className={`cursor-pointer rounded-xl p-1.5 ${
    isImageSearchActive ? "bg-black text-white" : "text-black"
  }`}
/>

          </div>

          <Button type="submit" className="absolute right-2 rounded-full">
            Search
          </Button>
        </div>
      </form>

      {isImageSearchActive && (<div className='mt-4'>
        <form onSubmit={handleImageSearch}>
          <div>{imagePreview?(
            <div className='flex flex-col items-center'>
            <img
            src={imagePreview}
            alt="Car Preview"
            className="h-40 object contain mb-4"
            />
            <Button
            variant="outline"
            className="text-gray-900"
            onClick={()=>{
              setSearchImage(null);
              setImagePreview("");
              toast.info("Image removed");
            }}
            >
              Remove Image
            </Button>
          </div>):(
               <div {...getRootProps()} className='cursor-pointer'>
                
              <input {...getInputProps()} />
       <div className='flex flex-col items-center'>
      <Upload className='h-12 w-12 text-gray-400 mb-2'/>
      <p>{
        isDragActive && !isDragReject
        ? "Leave the file here to upload"
        : "Drag & drop a car image here or click to select one"
      }
      </p>
      {isDragReject && (
        <p className="text-red-500 mb-2">Unsupported file type</p>
      )}
      <p className='text-gray-400 text-sm'>
        Supports: JPG, PNG (max 5MB)
      </p>
      </div>
      
    </div>
          )}</div>
        </form>
        </div>)}
    </div>
  )
}

export default HomeSearch