"use client";

import React, { use, useEffect, useState } from 'react'
import { Input } from './ui/input';
import { Camera, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { processImageSearch } from '@/actions/home';
import useFetch from '@/hooks/use-fetch';

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const router = useRouter();

  const{
    loading: isProcessing,
    fn: processImageFn,
    data: processResult,
    error: processError,
  } = useFetch(processImageSearch);

  const handleTextSubmit =async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`);
  };
  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!searchImage) {
      toast.error("Please upload an image first");
      return;
    }

    //add ai logic

    await processImageFn(searchImage);
  };

  useEffect(()=>{
    if(processError) {
      toast.error(
        "Failed to analyze image: " + (processError.message || "Unknown error")
      )
    }
  },[processError])

  useEffect(()=> {
    if(processResult?.success){
      const params = new URLSearchParams();

       if (processResult.data.make) params.set("make", processResult.data.make);
      if (processResult.data.bodyType)
        params.set("bodyType", processResult.data.bodyType);
      if (processResult.data.color)
        params.set("color", processResult.data.color);

      router.push(`/cars?${params.toString()}`);
    }
  }, [processResult, router])

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
      "image/*": [".jpeg", ".jpg", ".png"]
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
          <div className='border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center'>
            {imagePreview?(
            <div className='flex flex-col items-center'>
            <img
            src={imagePreview}
            alt="Car Preview"
            className="h-40 object-contain mb-4"
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
          {imagePreview && <Button
          type="submit"
          className="w-full mt-2"
          disabled={isUploading || isProcessing}
          >{isUploading ? "Uploading..." : isProcessing? "Analyzing Image...":"Search with this image"}</Button>}
        </form>
        </div>)}
    </div>
  )
}

export default HomeSearch