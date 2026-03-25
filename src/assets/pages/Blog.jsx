import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const companyInfo = {
    name: "PSG SHOP",
    tagline: "Elegancia en cada detalle",
    description: "Tu destino para moños elegantes y accesorios de moda de alta calidad.",
    mission: "Ofrecer productos de la más alta calidad con un servicio excepcional, ayudando a nuestros clientes a expresar su estilo único a través de accesorios elegantes.",
    vision: "Ser la marca líder en accesorios de moda en Latinoamérica, reconocida por nuestra calidad, innovación y compromiso con la sostenibilidad.",
    values: [
      { title: "Calidad Premium", desc: "Cada moño es creado con materiales de la más alta calidad." },
      { title: "Diseño Único", desc: "Cada pieza es única y cuidadosamente diseñada." },
      { title: "Sostenibilidad", desc: "Comprometidos con prácticas ecológicas responsables." },
      { title: "Atención Personalizada", desc: "Servicio al cliente excepcional en cada interacción." },
      { title: "Innovación", desc: "Siempre a la vanguardia de las tendencias de moda." },
    ]
  };

  const team = [
    {
      id: 1,
      name: "María González",
      role: "Fundadora & Directora Creativa",
      bio: "Con más de 10 años de experiencia en moda y accesorios, María lidera nuestro equipo con visión artística y pasión por la excelencia.",
      image: "https://ui-avatars.com/api/?name=María+González&background=111827&color=ffffff&size=128"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Director de Operaciones",
      bio: "Experto en logística y atención al cliente, Carlos asegura que cada pedido sea procesado con eficiencia y cuidado.",
      image: "https://ui-avatars.com/api/?name=Carlos+Rodríguez&background=374151&color=ffffff&size=128"
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Diseñadora Principal",
      bio: "Artista del textil con un ojo meticuloso para el detalle, Ana crea cada diseño con inspiración y precisión.",
      image: "https://ui-avatars.com/api/?name=Ana+Martínez&background=4b5563&color=ffffff&size=128"
    }
  ];

  const achievements = [
    { number: "500+", label: "Clientes Satisfechos" },
    { number: "100+", label: "Diseños Únicos" },
    { number: "5.0★", label: "Calificación Promedio" },
    { number: "24/7", label: "Soporte al Cliente" },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ─── Hero ─── */}
      <section className="bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Sobre Nosotros</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            {companyInfo.tagline}
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            {companyInfo.description}
          </p>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {achievements.map((item, i) => (
              <div key={i} className="py-10 px-6 text-center">
                <p className="text-3xl font-black text-gray-900 mb-1">{item.number}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <section className="max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left column */}
          <div className="lg:flex-1 space-y-8">

            {/* Our Story */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-8 pt-8 pb-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Nuestra Historia</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">Cómo comenzamos</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  PSG SHOP nació de la pasión por la elegancia y el detalle. Fundada en 2015 por María González,
                  nuestra tienda comenzó como un pequeño taller artesanal en el corazón de Cajamarca, Tolima.
                  Con el tiempo, hemos crecido hasta convertirnos en un referente de calidad en accesorios de moda.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Cada moño que creamos es una obra de arte, elaborada con materiales premium y técnicas tradicionales
                  que han sido perfeccionadas a lo largo de generaciones. Nuestro compromiso es ayudarte a expresar
                  tu estilo único con accesorios que no solo complementan tu look, sino que también cuentan tu historia.
                </p>
              </div>
              <div className="px-8 pb-8">
                <img
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                  alt="Nuestro taller"
                  className="w-full h-56 object-cover rounded-xl border border-gray-100"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/900x350.png?text=PSG+SHOP'; }}
                />
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Misión</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">{companyInfo.mission}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Visión</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">{companyInfo.vision}</p>
              </div>
            </div>

            {/* Values */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Nuestros Valores</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Lo que nos define</h2>
              <ul className="space-y-4">
                {companyInfo.values.map((value, index) => (
                  <li key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-150">
                    <span className="flex items-center justify-center flex-shrink-0 w-7 h-7 bg-black text-white text-xs font-bold rounded-full">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{value.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{value.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:w-80 space-y-6">

            {/* Team */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Equipo</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1 mb-5">Las personas detrás de PSG</h3>
              <div className="space-y-6">
                {team.map((member) => (
                  <div key={member.id} className="flex gap-3">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{member.name}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{member.role}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gray-900 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              <div className="relative z-10">
                <h3 className="text-base font-bold text-white mb-2">¿Tienes preguntas?</h3>
                <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                  Estamos aquí para ayudarte. Nuestro equipo te atenderá personalmente.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-150"
                >
                  Contáctanos
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>

            {/* Shop CTA */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-2">Descubre la Colección</h3>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Explora nuestra exclusiva colección de moños artesanales, diseñados para cada ocasión especial.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-150"
              >
                Ver Productos
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;