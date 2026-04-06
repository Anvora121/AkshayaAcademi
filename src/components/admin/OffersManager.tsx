import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; // Assuming Label component is available
import { Input } from '@/components/ui/input'; // Assuming Input component is available
import { Loader2, ImagePlus } from 'lucide-react';

export interface OfferData {
    _id?: string;
    universityName: string;
    description: string;
    originalFee: number;
    discountedFee: number;
    offerStartDate: string;
    offerEndDate: string;
    isActive: boolean;
    premiumOnlyAction: boolean;
    imageUrl?: string;
}

export const OffersManager = () => {
    const { user } = useAuth();
    const [offers, setOffers] = useState<OfferData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [formData, setFormData] = useState<OfferData>({
        universityName: '',
        description: '',
        originalFee: 0,
        discountedFee: 0,
        offerStartDate: new Date().toISOString().slice(0, 16),
        offerEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        isActive: true,
        premiumOnlyAction: true,
        imageUrl: ''
    });

    const fetchOffers = async (currentPage = page) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/offers?page=${currentPage}&limit=10`);
            if (response.ok) {
                const data = await response.json();
                if (data.offers && data.pagination) {
                    setOffers(data.offers);
                    setTotalPages(data.pagination.pages);
                    setPage(data.pagination.page);
                } else if (Array.isArray(data)) {
                    setOffers(data);
                    setTotalPages(1);
                }
            } else {
                setError('Failed to fetch offers');
            }
        } catch (err) {
            setError('Network error. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        let newValue: string | number | boolean = value;
        if (type === 'number') {
            newValue = Number(value);
        } else if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        }

        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const requestUrl = isEditing && formData._id
                ? `${API_BASE_URL}/offers/${formData._id}`
                : `${API_BASE_URL}/offers`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(requestUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchOffers();
                resetForm();
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to save offer');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                fetchOffers();
            } else {
                setError('Failed to delete offer');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    const handleEdit = (offer: OfferData) => {
        setFormData({
            ...offer,
            offerStartDate: new Date(offer.offerStartDate).toISOString().slice(0, 16),
            offerEndDate: new Date(offer.offerEndDate).toISOString().slice(0, 16)
        });
        setIsEditing(true);
    };

    const resetForm = () => {
        setFormData({
            universityName: '',
            description: '',
            originalFee: 0,
            discountedFee: 0,
            offerStartDate: new Date().toISOString().slice(0, 16),
            offerEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            isActive: true,
            premiumOnlyAction: true,
            imageUrl: ''
        });
        setIsEditing(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            // Replace with actual Cloudinary cloud name and unsigned upload preset or use env vars
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dfm2ofzso';
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'akshaya_unsigned';

            formData.append('upload_preset', uploadPreset);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({ ...prev, imageUrl: data.secure_url }));
            } else {
                setError('Failed to upload image to Cloudinary');
            }
        } catch (err) {
            setError('Error uploading image');
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className="space-y-8">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
                    {error}
                </div>
            )}

            {/* Offer Form */}
            <div className="premium-card p-6 border-l-4 border-l-accent">
                <h3 className="text-xl font-bold text-foreground mb-4">
                    {isEditing ? 'Edit Offer' : 'Create New Offer'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">University Name</label>
                            <input
                                type="text"
                                name="universityName"
                                value={formData.universityName}
                                onChange={handleInputChange}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Original Fee ($)</label>
                            <input
                                type="number"
                                name="originalFee"
                                value={formData.originalFee}
                                onChange={handleInputChange}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                                required
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Discounted Fee ($)</label>
                            <input
                                type="number"
                                name="discountedFee"
                                value={formData.discountedFee}
                                onChange={handleInputChange}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                                required
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                            <input
                                type="datetime-local"
                                name="offerStartDate"
                                value={formData.offerStartDate}
                                onChange={handleInputChange}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
                            <input
                                type="datetime-local"
                                name="offerEndDate"
                                value={formData.offerEndDate}
                                onChange={handleInputChange}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-accent"
                                />
                                <span className="text-sm font-medium text-foreground">Active Offer</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="premiumOnlyAction"
                                    checked={formData.premiumOnlyAction}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-accent"
                                />
                                <span className="text-sm font-medium text-foreground">Premium Only</span>
                            </label>
                        </div>
                    </div>
                    <div className="space-y-2 col-span-1 md:col-span-2 mt-4">
                        <label className="block text-sm font-medium text-foreground mb-1">Banner Image (Optional)</label>
                        <div className="flex items-center gap-4">
                            <div className="relative border-2 border-dashed border-border rounded-lg p-4 hover:bg-secondary/20 transition-colors flex-1 flex flex-col items-center justify-center cursor-pointer overflow-hidden min-h-[120px]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={uploadingImage}
                                />
                                {uploadingImage ? (
                                    <div className="flex flex-col items-center text-muted-foreground">
                                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                        <span className="text-sm">Uploading...</span>
                                    </div>
                                ) : formData.imageUrl ? (
                                    <div className="absolute inset-0 w-full h-full">
                                        <img src={formData.imageUrl} alt="Banner preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white text-sm font-medium flex items-center gap-2">
                                                <ImagePlus className="w-4 h-4" /> Change Image
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-muted-foreground">
                                        <ImagePlus className="w-8 h-8 mb-2" />
                                        <span className="text-sm font-medium">Click or drag image to upload</span>
                                        <span className="text-xs">Supported: JPG, PNG, WEBP</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {formData.imageUrl && (
                            <p className="text-xs text-muted-foreground truncate">
                                Current URL: <a href={formData.imageUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">{formData.imageUrl}</a>
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        {isEditing && (
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" className="bg-accent hover:bg-accent/90 text-white">
                            {isEditing ? 'Update Offer' : 'Create Offer'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Offers List */}
            <div className="premium-card p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Existing Offers</h3>

                {
                    isLoading ? (
                        <p className="text-muted-foreground">Loading offers...</p>
                    ) : offers.length === 0 ? (
                        <p className="text-muted-foreground">No offers exist in the database yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-secondary text-secondary-foreground border-b border-border">
                                    <tr>
                                        <th className="p-3 font-semibold pb-3">University</th>
                                        <th className="p-3 font-semibold pb-3">Discount</th>
                                        <th className="p-3 font-semibold pb-3">Status</th>
                                        <th className="p-3 font-semibold pb-3">Ends</th>
                                        <th className="p-3 font-semibold pb-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {offers.map((offer) => {
                                        const isExpired = new Date(offer.offerEndDate) < new Date();

                                        return (
                                            <tr key={offer._id} className="hover:bg-secondary/50">
                                                <td className="p-3 font-medium text-foreground">
                                                    {offer.universityName}
                                                </td>
                                                <td className="p-3 text-muted-foreground">
                                                    ${offer.discountedFee.toLocaleString()}
                                                    <span className="text-xs line-through ml-2 text-muted-foreground/50">${offer.originalFee.toLocaleString()}</span>
                                                </td>
                                                <td className="p-3">
                                                    {!offer.isActive ? (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">Inactive</span>
                                                    ) : isExpired ? (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">Expired</span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">Active</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-muted-foreground">
                                                    {new Date(offer.offerEndDate).toLocaleDateString()}
                                                </td>
                                                <td className="p-3 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(offer)}
                                                        className="px-3 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded transition-colors text-xs font-semibold"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => offer._id && handleDelete(offer._id)}
                                                        className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded transition-colors text-xs font-semibold"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-6 py-2 border-t border-border">
                                    <span className="text-sm text-muted-foreground">
                                        Page {page} of {totalPages}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fetchOffers(Math.max(1, page - 1))}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fetchOffers(Math.min(totalPages, page + 1))}
                                            disabled={page === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }
            </div >
        </div >
    );
};
