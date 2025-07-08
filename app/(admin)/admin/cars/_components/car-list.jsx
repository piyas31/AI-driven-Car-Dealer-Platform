"use client";


import { deleteCar, getCars, updateCarStatus } from '@/actions/cars';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useFetch from '@/hooks/use-fetch';
import client from '@/lib/generated/prisma/client'
import { formatCurrency } from '@/lib/helpers';
import {  CarIcon, Eye, Loader2, MoreHorizontal, Plus, Search, Star, StarOff, Trash2 } from 'lucide-react'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const CarsList = () => {

    const [search, setSearch] = useState("");
    const [carToDelete, setCarToDelete] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const router = useRouter();

      const {
    loading: loadingCars,
    fn: fetchCars,
    data: carsData,
    error: carsError,
  } = useFetch(getCars);

  const {
    loading: deletingCar,
    fn: deleteCarFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteCar);

  const {
    loading: updatingCar,
    fn: updateCarStatusFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateCarStatus);

    useEffect(() => {
    fetchCars(search);
  }, [search]);

  useEffect(() => {
    if (carsError) {
      toast.error("Failed to load cars");
    }

    if (deleteError) {
      toast.error("Failed to delete car");
    }

    if (updateError) {
      toast.error("Failed to update car");
    }
  }, [carsError, deleteError, updateError]);


  useEffect(() => {
    if (deleteResult?.success) {
      toast.success("Car deleted successfully");
      fetchCars(search);
    }

    if (updateResult?.success) {
      toast.success("Car updated successfully");
      fetchCars(search);
    }
  }, [deleteResult, updateResult]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

     const handleDeleteCar = async () => {
    if (!carToDelete) return;

    await deleteCarFn(carToDelete.id);
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };


  const handleToggleFeatured = async (car) => {
    await updateCarStatusFn(car.id, { featured: !car.featured });
  };

  const handleStatusUpdate = async (car, newStatus) => {
    await updateCarStatusFn(car.id, { status: newStatus });
  };


    const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        );
      case "UNAVAILABLE":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Unavailable
          </Badge>
        );
      case "SOLD":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Sold
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };


  return (
    <div className='space-y-4'>
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
            <Button onClick={() => router.push('/admin/cars/create')}
                className="flex items-center"
                >
                <Plus className='h-4 w-4'/>
                Add Car
                </Button>
                <form onSubmit={handleSearchSubmit} className='flex w-full sm:w-auto'>
                    <div className='relative flex-1'>
                        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500'/>
                        <Input className="pl-9 w-full sm:w-60"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="search"
                        placeholder="Search Cars..."
                        />
                    </div>
                </form>
        </div>

        {/* Cars Table */}

        <Card>
  <CardContent className="p-0">
   {loadingCars && !carsData ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : carsData?.success && carsData.data.length > 0 ? (
          <div className='overflow-x-auto'>

            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Make & Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carsData.data.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div className="w-10 h-10 rounded-md overflow-hidden">
                          {car.images && car.images.length > 0 ? (
                            <Image
                              src={car.images[0]}
                              alt={`${car.make} ${car.model}`}
                              height={40}
                              width={40}
                              className="w-full h-full object-cover"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <CarIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {car.make} {car.model}
                      </TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>{formatCurrency(car.price)}</TableCell>
                      <TableCell>{getStatusBadge(car.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-9 w-9"
                          onClick={() => handleToggleFeatured(car)}
                          disabled={updatingCar}
                        >
                          {car.featured ? (
                            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/cars/${car.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(car, "AVAILABLE")
                              }
                              disabled={
                                car.status === "AVAILABLE" || updatingCar
                              }
                            >
                              Set Available
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(car, "UNAVAILABLE")
                              }
                              disabled={
                                car.status === "UNAVAILABLE" || updatingCar
                              }
                            >
                              Set Unavailable
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(car, "SOLD")}
                              disabled={car.status === "SOLD" || updatingCar}
                            >
                              Mark as Sold
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setCarToDelete(car);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div> 
        ) : ( 
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
             <CarIcon className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No cars found
              </h3>
              <p className="text-gray-500 mb-4">
                {search
                  ? "No cars match your search criteria"
                  : "Your inventory is empty. Add cars to get started."}
              </p>
              <Button onClick={() => router.push("/admin/cars/create")}>
                Add Your First Car
              </Button>
          </div>

          )}
  </CardContent>
</Card>

<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {carToDelete?.make}{" "}
              {carToDelete?.model} ({carToDelete?.year})? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingCar}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCar}
              disabled={deletingCar}
            >
              {deletingCar ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Car"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CarsList