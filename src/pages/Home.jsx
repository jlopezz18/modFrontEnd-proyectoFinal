import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWeather } from '../services/weatherService';

const Home = () => {
  const [city, setCity] = useState('');
  const [cardsData, setCardsData] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // guardamos las ciudades recientes
  const [recents, setRecents] = useState(['London', 'Tokyo', 'New York']);

  // cargar ciudades del localstorage o las de por defecto al iniciar
  useEffect(() => {
    const guardadas = localStorage.getItem('recentCities');
    let ciudadesIniciales = ['London', 'Tokyo', 'New York'];

    if (guardadas) {
      ciudadesIniciales = JSON.parse(guardadas);
      setRecents(ciudadesIniciales);
    }

    const cargarCiudades = async () => {
      try {
        const lista = [];
        for (let i = 0; i < ciudadesIniciales.length && i < 3; i++) {
          const res = await getCurrentWeather(ciudadesIniciales[i]);
          lista.push(res);
        }
        setCardsData(lista);
      } catch (err) {
        console.log('error cargando ciudades iniciales', err);
      }
    };

    cargarCiudades();
  }, []);

  const buscarCiudad = async (nombreCiudad) => {
    setError('');
    if (!nombreCiudad.trim()) return;

    try {
      const data = await getCurrentWeather(nombreCiudad);
      
      // ponemos la nueva ciudad primera sin repetir
      const sinRepetir = cardsData.filter(item => item.name.toLowerCase() !== data.name.toLowerCase());
      const nuevasCards = [data, ...sinRepetir].slice(0, 3);
      setCardsData(nuevasCards);

      const nuevosRecientes = [data.name, ...recents.filter(c => c.toLowerCase() !== data.name.toLowerCase())].slice(0, 3);
      setRecents(nuevosRecientes);
      localStorage.setItem('recentCities', JSON.stringify(nuevosRecientes));
      
      setCity('');
    } catch (err) {
      setError('No se encontro la ciudad, prueba con otra');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    buscarCiudad(city);
  };

  return (
    <div className='layout-principal' style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0F172A', color: 'white'}}>
      {/* menu lateral */}
      <aside className='menu-lateral' style={{ width: '250px', backgroundColor: '#162032', padding: '35px 25px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(126, 147, 180, 0.15)' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '50px', color: 'white' }}>
          Juan's Weather Forecast
        </h1>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '12px 16px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
            <span>💧</span> Dashboard
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#7E93B4', padding: '12px 16px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
            <span>🗺️</span> Mapa
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#7E93B4', padding: '12px 16px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
            <span>⚙️</span> Configuracion
          </div>
        </nav>
      </aside>

      {/* contenedor derecho */}
      <main className='contenedor-main' style={{ flex: 1, padding: '40px 60px', maxWidth: '1000px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', marginTop: 0 }}>Buscar</h2>

        <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '650px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Buscar Ciudad..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ width: '100%', padding: '16px 50px 16px 24px', borderRadius: '30px', border: '1px solid rgba(126, 147, 180, 0.4)', backgroundColor: '#162032', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
          />
          <button
            type="submit"
            style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#38BDF8', fontSize: '20px', cursor: 'pointer' }}
          >
            🔍
          </button>
        </form>

        {/* historial de recientes */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '35px' }}>
          <span style={{ color: '#7E93B4', fontSize: '15px' }}>Recientes:</span>
          {recents.map((recentCity, index) => (
            <button
              key={index}
              onClick={() => buscarCiudad(recentCity)}
              style={{ padding: '6px 16px', backgroundColor: '#1E293B', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            >
              {recentCity}
            </button>
          ))}
        </div>

        {error && <p style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>}

        {/* tarjetas de las 3 ciudades */}
        <div className='grid-tres-cards' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
          {cardsData.map((data, index) => (
            <div
              key={index}
              onClick={() => navigate(`/ciudad/${data.name}`)}
              style={{ backgroundColor: '#162032', padding: '24px', borderRadius: '18px', cursor: 'pointer', border: '1px solid rgba(126, 147, 180, 0.15)' }}
            >
              <h3 style={{ margin: '0', fontSize: '22px', fontWeight: '600' }}>{data.name}</h3>
              <span style={{ color: '#7E93B4', fontSize: '13px', fontWeight: '600' }}>{data.sys.country}</span>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0 5px 0' }}>
                <span style={{ fontSize: '42px', fontWeight: 'bold' }}>{Math.round(data.main.temp)}°C</span>
                <img
                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt={data.weather[0].description}
                  style={{ width: '70px', height: '70px' }}
                />
              </div>

              <p style={{ margin: '0 0 15px 0', color: '#7E93B4', fontSize: '14px', textTransform: 'capitalize' }}>
                {data.weather[0].description}
              </p>

              <div style={{ borderTop: '1px solid rgba(126, 147, 180, 0.2)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7E93B4' }}>Humedad</span>
                  <span style={{ fontWeight: '600' }}>{data.main.humidity}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7E93B4' }}>Viento</span>
                  <span style={{ fontWeight: '600' }}>{Math.round(data.wind.speed * 3.6)}km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* bloque del mapa */}
        <div style={{ backgroundColor: '#111927', borderRadius: '20px', padding: '24px 30px', border: '1px solid rgba(126, 147, 180, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Selector Mapa Mundial</h3>
            <span style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid rgba(126, 147, 180, 0.4)', fontSize: '12px', color: 'white' }}>
              Explora el mapa metereologico
            </span>
          </div>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '12px', backgroundColor: '#0F172A' }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg"
              alt="Mapa Mundial"
              style={{ width: '85%', maxHeight: '200px', objectFit: 'contain', opacity: 0.25 }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;