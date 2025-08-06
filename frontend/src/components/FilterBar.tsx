interface Props {
  search: string;
  setSearch: (v: string) => void;
  genre: string;
  setGenre: (v: string) => void;
  editorial: string;
  setEditorial: (v: string) => void;
  author: string;
  setAuthor: (v: string) => void;
  available: string;
  setAvailable: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
}

const FilterBar = ({
  search, setSearch,
  genre, setGenre,
  editorial, setEditorial,
  author, setAuthor,
  available, setAvailable,
  sort, setSort
}: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <input
        placeholder="Buscar título..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        placeholder="Género"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        placeholder="Editorial"
        value={editorial}
        onChange={(e) => setEditorial(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        placeholder="Autor"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="p-2 border rounded"
      />
      <select
        value={available}
        onChange={(e) => setAvailable(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Todos</option>
        <option value="true">Disponible</option>
        <option value="false">No disponible</option>
      </select>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Ordenar por</option>
        <option value="title">Título</option>
        <option value="price">Precio</option>
      </select>
    </div>
  );
};

export default FilterBar;
