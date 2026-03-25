import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [state, handleSubmit] = useForm("mpwybkly");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputCls = "block w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-150 placeholder-gray-400";

  const contactItems = [
    {
      icon: (
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: "Teléfono",
      value: "(123) 456-7890",
      sub: "Lun – Vie, 9:00 AM – 6:00 PM",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: "psgmoños@gmail.com",
      sub: "Respuesta en 24 horas hábiles",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Ubicación",
      value: "Cajamarca, Tolima",
      sub: "Colombia",
    },
  ];

  const schedule = [
    { day: "Lunes – Viernes", hours: "9:00 AM – 6:00 PM", open: true },
    { day: "Sábado", hours: "10:00 AM – 4:00 PM", open: true },
    { day: "Domingo", hours: "Cerrado", open: false },
  ];

  const faqs = [
    { q: "¿Cuánto tiempo tardan en responder?", a: "Respondemos todos los mensajes dentro de las 24 horas hábiles." },
    { q: "¿Ofrecen envío internacional?", a: "Sí, enviamos a varios países. Los costos y tiempos varían según la ubicación." },
    { q: "¿Puedo cambiar o devolver un producto?", a: "Ofrecemos devoluciones dentro de los 30 días posteriores a la compra." },
    { q: "¿Cómo puedo rastrear mi pedido?", a: "Recibirás un email con el número de seguimiento una vez enviado tu pedido." },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ─── Hero ─── */}
      <section className="bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Contacto</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Hablemos
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            ¿Tienes preguntas? Estamos aquí para ayudarte. Envíanos un mensaje y nos pondremos en contacto contigo pronto.
          </p>
        </div>
      </section>

      {/* ─── Body ─── */}
      <section className="max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8">

        {/* Success banner */}
        {state.succeeded && (
          <div className="mb-8 flex gap-3 items-start p-4 bg-green-50 border border-green-200 rounded-2xl">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-800">¡Mensaje enviado!</p>
              <p className="text-sm text-green-700 mt-0.5">Hemos recibido tu mensaje y nos pondremos en contacto pronto.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

          {/* ─── Contact Form ─── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Formulario</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-7">Envíanos un mensaje</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className={inputCls}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={inputCls}
                      placeholder="tu@email.com"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="mt-1 text-xs text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Asunto
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="¿Sobre qué te gustaría hablar?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`${inputCls} resize-none`}
                    placeholder="Escribe tu mensaje aquí..."
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="mt-1 text-xs text-red-600" />
                </div>

                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full py-3 px-6 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 active:bg-gray-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-40"
                >
                  {state.submitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            </div>

            {/* ─── FAQ ─── */}
            <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">FAQ</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-7">Preguntas Frecuentes</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-5 bg-gray-50 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors duration-150">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Sidebar: Info + Hours + Social ─── */}
          <div className="space-y-6">

            {/* Contact info */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Información</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1 mb-5">Cómo contactarnos</h3>
              <div className="space-y-5">
                {contactItems.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 pt-6 pb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Ubicación</span>
                <h3 className="text-base font-bold text-gray-900 mt-1">Dónde encontrarnos</h3>
              </div>
              <div className="h-48 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15782.9116518304!2d-75.31303365!3d4.48527395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38f5a5a5a5a5a5%3A0x5a5a5a5a5a5a5a5a!2sCajamarca%2C%20Tolima%2C%20Colombia!5e0!3m2!1sen!2sco!4v1678901234567!5m2!1sen!2sco"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación PSG SHOP – Cajamarca, Tolima, Colombia"
                />
              </div>
              <div className="px-6 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Cajamarca, Tolima · Colombia</p>
              </div>
            </div>

            {/* Business hours */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Horario</span>
              <h3 className="text-base font-bold text-gray-900 mt-1 mb-4">Atención al cliente</h3>
              <ul className="space-y-3">
                {schedule.map((s, i) => (
                  <li key={i} className="flex items-center justify-between text-sm pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <span className="text-gray-600">{s.day}</span>
                    <span className={`font-medium ${s.open ? 'text-gray-900' : 'text-gray-400'}`}>{s.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social media */}
            <div className="bg-gray-900 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              <div className="relative z-10">
                <h3 className="text-base font-bold text-white mb-1">Síguenos en redes</h3>
                <p className="text-sm text-gray-400 mb-5">Mantente al día con nuestras novedades y promociones</p>
                <div className="flex gap-3">
                  {[
                    { label: "Twitter", path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" },
                    { label: "Facebook", path: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" },
                    { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.689-.072 4.849-.072zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href="#"
                      aria-label={social.label}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:border-white hover:text-white transition-all duration-150"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d={social.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;