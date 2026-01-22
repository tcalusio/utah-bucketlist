const { useState, useEffect } = React;
const { Plus, Trash2, MapPin, Edit2, Check, X } = lucide;

const UtahBucketList = () => {
    const [categories, setCategories] = useState({
        restaurants: [],
        travel: [],
        sports: []
    });
    const [newItem, setNewItem] = useState({ category: 'restaurants', name: '', link: '' });
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const categoryInfo = {
        restaurants: { title: '🍽️ Restaurantes', color: 'bg-orange-500' },
        travel: { title: '✈️ Destinos de Viaje', color: 'bg-green-500' },
        sports: { title: '🏀 Deportes', color: 'bg-blue-500' }
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const stored = localStorage.getItem('utah-bucket-list');
            if (stored) {
                setCategories(JSON.parse(stored));
            }
        } catch (error) {
            console.log('No hay datos guardados aún');
        } finally {
            setLoading(false);
        }
    };

    const saveData = (newCategories) => {
        try {
            localStorage.setItem('utah-bucket-list', JSON.stringify(newCategories));
            setCategories(newCategories);
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Hubo un error al guardar. Por favor intenta de nuevo.');
        }
    };

    const addItem = () => {
        if (!newItem.name.trim()) return;
        
        const updatedCategories = {
            ...categories,
            [newItem.category]: [...categories[newItem.category], {
                id: Date.now(),
                name: newItem.name,
                link: newItem.link,
                completed: false
            }]
        };
        
        saveData(updatedCategories);
        setNewItem({ category: 'restaurants', name: '', link: '' });
    };

    const deleteItem = (category, id) => {
        const updatedCategories = {
            ...categories,
            [category]: categories[category].filter(item => item.id !== id)
        };
        saveData(updatedCategories);
    };

    const toggleComplete = (category, id) => {
        const updatedCategories = {
            ...categories,
            [category]: categories[category].map(item =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        };
        saveData(updatedCategories);
    };

    const startEdit = (category, item) => {
        setEditingItem({ ...item, category });
    };

    const saveEdit = () => {
        if (!editingItem.name.trim()) return;
        
        const updatedCategories = {
            ...categories,
            [editingItem.category]: categories[editingItem.category].map(item =>
                item.id === editingItem.id ? { 
                    id: item.id, 
                    name: editingItem.name, 
                    link: editingItem.link,
                    completed: item.completed 
                } : item
            )
        };
        
        saveData(updatedCategories);
        setEditingItem(null);
    };

    const cancelEdit = () => {
        setEditingItem(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-3">
                        Utah Bucket List 🏔️
                    </h1>
                    <p className="text-xl text-gray-600">Virna & Tú - Salt Lake City Adventures</p>
                    <p className="text-sm text-gray-500 mt-2">✨ Lista compartida - Ambos pueden agregar y editar</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">➕ Agregar Nuevo</h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        >
                            <option value="restaurants">🍽️ Restaurantes</option>
                            <option value="travel">✈️ Viajes</option>
                            <option value="sports">🏀 Deportes</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Nombre del lugar/evento"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && addItem()}
                        />
                        <input
                            type="text"
                            placeholder="Link de Google Maps (opcional)"
                            value={newItem.link}
                            onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                            className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && addItem()}
                        />
                        <button
                            onClick={addItem}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <Plus size={20} /> Agregar
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {['restaurants', 'travel', 'sports'].map((key) => {
                        const info = categoryInfo[key];
                        return (
                            <div key={key} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className={`${info.color} p-4`}>
                                    <h2 className="text-2xl font-bold text-white">{info.title}</h2>
                                </div>
                                <div className="p-4">
                                    {categories[key].length === 0 ? (
                                        <p className="text-gray-400 text-center py-8 italic">
                                            No hay items aún.<br />¡Agrega uno arriba!
                                        </p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {categories[key].map((item) => (
                                                <li key={item.id} className="border-2 border-gray-100 rounded-lg p-3 hover:border-gray-300 transition-colors">
                                                    {editingItem?.id === item.id ? (
                                                        <div className="space-y-2">
                                                            <input
                                                                type="text"
                                                                value={editingItem.name}
                                                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                                                className="w-full p-2 border-2 border-blue-300 rounded focus:outline-none"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editingItem.link}
                                                                onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                                                                placeholder="Link de Google Maps"
                                                                className="w-full p-2 border-2 border-blue-300 rounded focus:outline-none"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={saveEdit}
                                                                    className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center gap-1"
                                                                >
                                                                    <Check size={16} /> Guardar
                                                                </button>
                                                                <button
                                                                    onClick={cancelEdit}
                                                                    className="flex-1 bg-gray-400 text-white p-2 rounded hover:bg-gray-500 flex items-center justify-center gap-1"
                                                                >
                                                                    <X size={16} /> Cancelar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex items-start gap-2 flex-1">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={item.completed}
                                                                        onChange={() => toggleComplete(key, item.id)}
                                                                        className="mt-1 w-5 h-5 cursor-pointer"
                                                                    />
                                                                    <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}`}>
                                                                        {item.name}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <button
                                                                        onClick={() => startEdit(key, item)}
                                                                        className="text-blue-500 hover:text-blue-700 p-1"
                                                                        title="Editar"
                                                                    >
                                                                        <Edit2 size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteItem(key, item.id)}
                                                                        className="text-red-500 hover:text-red-700 p-1"
                                                                        title="Eliminar"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {item.link && (
                                                                
                                                                    href={item.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm mt-2 ml-7"
                                                                >
                                                                    <MapPin size={14} /> Ver en Maps
                                                                </a>
                                                            )}
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">📊 Estadísticas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(categories).map(([key, items]) => {
                            const completed = items.filter(i => i.completed).length;
                            const total = items.length;
                            return (
                                <div key={key} className="text-center">
                                    <div className="text-3xl font-bold text-gray-800">{completed}/{total}</div>
                                    <div className="text-sm text-gray-600">{categoryInfo[key].title}</div>
                                </div>
                            );
                        })}
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">
                                {Object.values(categories).reduce((acc, arr) => acc + arr.filter(i => i.completed).length, 0)}/
                                {Object.values(categories).reduce((acc, arr) => acc + arr.length, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Completado</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UtahBucketList />);
