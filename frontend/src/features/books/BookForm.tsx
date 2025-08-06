import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const getSchema = (isEdit: boolean) =>
  z.object({
    title: isEdit ? z.string().optional() : z.string().min(1, 'Título requerido'),
    author: isEdit ? z.string().optional() : z.string().min(1, 'Autor requerido'),
    editorial: isEdit ? z.string().optional() : z.string().min(1, 'Editorial requerida'),
    genre: isEdit ? z.string().optional() : z.string().min(1, 'Género requerido'),
    price: isEdit ? z.number().optional() : z.number().min(0, 'Precio no válido'),
    available: z.boolean(),
    image: z.any().optional(),
  });

type FormData = z.infer<ReturnType<typeof getSchema>>;

const BookForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [initialData, setInitialData] = useState<FormData | null>(null);

  const schema = useMemo(() => getSchema(isEdit), [isEdit]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const imageFile = watch('image');

  // ==================== Etapa 1: CARGA DE DATOS ====================
  useEffect(() => {
    if (isEdit) {
      api.get(`/books/${id}`).then((res) => {
        const book = res.data.data;

        const parsed: FormData = {
          title: book.title,
          author: book.author,
          editorial: book.editorial,
          genre: book.genre,
          price: Number(book.price),
          available: book.available,
          image: undefined,
        };


        setInitialData(parsed);

        setValue('title', parsed.title);
        setValue('author', parsed.author);
        setValue('editorial', parsed.editorial);
        setValue('genre', parsed.genre);
        setValue('price', parsed.price);
        setValue('available', parsed.available);

        if (book.imageUrl) {
          setPreviewUrl(`${import.meta.env.VITE_API_URL}${book.imageUrl}`);
        }

        setLoading(false);
      });
    }
  }, [id, isEdit, setValue]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const onSubmit = async (data: FormData) => {
    if (isEdit && !initialData) return;

    const merged = {
      title: data.title ?? initialData?.title ?? '',
      author: data.author ?? initialData?.author ?? '',
      editorial: data.editorial ?? initialData?.editorial ?? '',
      genre: data.genre ?? initialData?.genre ?? '',
      price: typeof data.price === 'number' ? data.price : initialData?.price ?? 0,
      available: data.available ?? initialData?.available ?? false,
    };


    const formData = new FormData();
    formData.append('title', merged.title || '');
    formData.append('author', merged.author || '');
    formData.append('editorial', merged.editorial || '');
    formData.append('genre', merged.genre || '');
    formData.append('price', merged.price.toString());
    formData.append('available', merged.available.toString());

    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      if (isEdit) {
        await api.put(`/books/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/books', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/books');
    } catch (err) {
      alert('Error al guardar el libro');
      console.error('[Etapa 3] Error al guardar:', err);
    }
  };

  // ==================== UI ====================
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{isEdit ? 'Editar libro' : 'Crear nuevo libro'}</h2>

      <input {...register('title')} placeholder="Título" className="w-full p-2 border rounded" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <input {...register('author')} placeholder="Autor" className="w-full p-2 border rounded" />
      {errors.author && <p className="text-red-500">{errors.author.message}</p>}

      <input {...register('editorial')} placeholder="Editorial" className="w-full p-2 border rounded" />
      {errors.editorial && <p className="text-red-500">{errors.editorial.message}</p>}

      <input {...register('genre')} placeholder="Género" className="w-full p-2 border rounded" />
      {errors.genre && <p className="text-red-500">{errors.genre.message}</p>}

      <input
        type="number"
        step="0.01"
        {...register('price', { valueAsNumber: true })}
        placeholder="Precio"
        className="w-full p-2 border rounded"
      />
      {errors.price && <p className="text-red-500">{errors.price.message}</p>}

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('available')} />
        Disponible
      </label>

      <input type="file" accept="image/*" {...register('image')} />
      {previewUrl && (
        <img src={previewUrl} alt="preview" className="h-40 object-cover rounded" />
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
      >
        {isEdit ? 'Guardar cambios' : 'Crear libro'}
      </button>
    </form>
  );
};

export default BookForm;
