import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCurrentWeather, getForecast } from '../services/weatherService';

const CityDetail = () => {
  const { nombre } = useParams();
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // comprobamos si la ciudad esta en favoritos
    const guardados = localStorage.getItem('favoriteCities');
    if (guardados) {
      const listaFavs = JSON.parse(guardados);
      setIsFavorite(listaFavs.includes(nombre));
    }

    const cargarDatos = async () => {
      try {
        const datosClima = await getCurrentWeather(nombre);
        const datosPronostico = await getForecast(nombre);
        setCurrent(datosClima);
        setForecast(datosPronostico);
      } catch (err) {
        setError('Error al cargar los detalles de la ciudad');
      }
    };
    cargarDatos();
  }, [nombre]);

  const toggleFavorite = () => {
    const guardados = localStorage.getItem('favoriteCities');
    let listaFavs = guardados ? JSON.parse(guardados) : [];

    if (isFavorite) {
      listaFavs = listaFavs.filter(city => city !== nombre);
    } else {
      listaFavs.push(nombre);
    }

    localStorage.setItem('favoriteCities', JSON.stringify(listaFavs));
    setIsFavorite(!isFavorite);
  };

  // filtramos un registro por dia (el de las 12:00) para sacar los 5 dias
  const obtenerCincoDias = () => {
    if (!forecast) return [];
    const dias = forecast.list.filter(item => item.dt_txt.includes('12:00:00'));
    return dias.slice(0, 5);
  };

  const obtenerNombreDia = (fechaTexto, index) => {
    if (index === 0) return 'Mañana';
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const fecha = new Date(fechaTexto);
    return diasSemana[fecha.getDay()];
  };

  const formatearHora = (dt_txt, index) => {
    if (index === 0) return 'Ahora';
    const hora = parseInt(dt_txt.substring(11, 13), 10);
    const ampm = hora >= 12 ? 'pm' : 'am';
    const hora12 = hora % 12 || 12;
    return `${hora12} ${ampm}`;
  };

  return (
    <div className='contenedor-detalle' style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: 'white', padding: '40px 60px' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        
        {/* parte superior*/}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <Link
              to="/"
              style={{ backgroundColor: '#1E293B', color: '#7E93B4', textDecoration: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '600', fontSize: '15px' }}
            >
              ‹ back
            </Link>
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
              {current ? `${current.name}, ${current.sys.country}` : nombre}
            </h1>
          </div>

          <button
            onClick={toggleFavorite}
            style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
          >
            <span style={{ color: '#38BDF8', fontSize: '22px' }}>{isFavorite ? '★' : '☆'}</span>
            {isFavorite ? 'En favoritos' : 'Añadir a favoritos'}
          </button>
        </div>

        {error && <p style={{ color: '#ef4444' }}>{error}</p>}

        {current && forecast && (
          <div className='grid-detalle' style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '40px' }}>
            
            {/*lado izquierdo*/}
            <div>
              <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '35px', marginBottom: '35px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '64px', fontWeight: 'bold', lineHeight: '1' }}>
                      {Math.round(current.main.temp)}°C
                    </div>
                    <p style={{ color: '#7E93B4', fontSize: '16px', marginTop: '12px', textTransform: 'lowercase' }}>
                      {current.weather[0].description}
                    </p>
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`}
                    alt="icono clima"
                    style={{ width: '130px', height: '130px' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(126, 147, 180, 0.25)', marginTop: '25px', paddingTop: '20px' }}>
                  <div style={{ paddingRight: '20px', paddingBottom: '15px', borderRight: '1px solid rgba(126, 147, 180, 0.25)', borderBottom: '1px solid rgba(126, 147, 180, 0.25)' }}>
                    <span style={{ color: '#7E93B4', fontSize: '14px' }}>💨 Viento</span>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '6px' }}>{Math.round(current.wind.speed * 3.6)} km/h</div>
                  </div>
                  <div style={{ paddingLeft: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(126, 147, 180, 0.25)' }}>
                    <span style={{ color: '#7E93B4', fontSize: '14px' }}>💧 Humedad</span>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '6px' }}>{current.main.humidity}%</div>
                  </div>
                  <div style={{ paddingRight: '20px', paddingTop: '15px', borderRight: '1px solid rgba(126, 147, 180, 0.25)' }}>
                    <span style={{ color: '#7E93B4', fontSize: '14px' }}>☀️ Indice UV</span>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '6px' }}>3- Moderado</div>
                  </div>
                  <div style={{ paddingLeft: '25px', paddingTop: '15px' }}>
                    <span style={{ color: '#7E93B4', fontSize: '14px' }}>👁️ Visibilidad</span>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '6px' }}>{Math.round(current.visibility / 1000)} Km</div>
                  </div>
                </div>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px' }}>Prevision por horas</h3>
              <div className='grid-horas' style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
                {forecast.list.slice(0, 5).map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#1E293B', borderRadius: '16px', padding: '18px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', minHeight: '130px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{formatearHora(item.dt_txt, idx)}</span>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt="icono hora"
                      style={{ width: '55px', height: '55px' }}
                    />
                    <span style={{ fontSize: '16px', color: '#E2E8F0' }}>{Math.round(item.main.temp)}°C</span>
                  </div>
                ))}
              </div>
            </div>

            {/*lado derecho*/}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '12px' }}>cuadro del mapa de temperaturas</h3>
              <div style={{ backgroundColor: '#1E293B', padding: '15px', borderRadius: '20px', marginBottom: '30px' }}>
                <iframe
                  title="mapa-ciudad"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '14px' }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${current.coord.lon - 0.1},${current.coord.lat - 0.1},${current.coord.lon + 0.1},${current.coord.lat + 0.1}&layer=mapnik&marker=${current.coord.lat},${current.coord.lon}`}
                />
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Prevision de 5 dias</h3>
              <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '10px 25px' }}>
                {obtenerCincoDias().map((dia, idx) => (
                  <div
                    key={idx}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: idx < 4 ? '1px solid rgba(126, 147, 180, 0.2)' : 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img
                        src={`https://openweathermap.org/img/wn/${dia.weather[0].icon}.png`}
                        alt="icono dia"
                        style={{ width: '40px', height: '40px' }}
                      />
                      <span style={{ fontSize: '16px', fontWeight: '500' }}>{obtenerNombreDia(dia.dt_txt, idx)}</span>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#E2E8F0' }}>
                      {Math.round(dia.main.temp_min)}° - {Math.round(dia.main.temp_max)}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CityDetail;