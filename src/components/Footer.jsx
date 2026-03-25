import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-0.5 mb-3">
              <span className="text-lg font-black tracking-tight text-black">PSG</span>
              <span className="w-1 h-1 rounded-full bg-black inline-block mx-1" />
              <span className="text-sm font-light tracking-widest text-gray-500 uppercase">SHOP</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Tu destino para moños elegantes y accesorios de moda de alta calidad.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Navegación</h4>
            <ul className="space-y-2.5">
              <li><Link to="/home" className="text-sm text-gray-600 hover:text-black transition-colors duration-150">Inicio</Link></li>
              <li><Link to="/shop" className="text-sm text-gray-600 hover:text-black transition-colors duration-150">Tienda</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-600 hover:text-black transition-colors duration-150">Sobre Nosotros</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-black transition-colors duration-150">Contacto</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Mi cuenta</h4>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="text-sm text-gray-600 hover:text-black transition-colors duration-150">Iniciar Sesión</Link></li>
              <li><Link to="/register" className="text-sm text-gray-600 hover:text-black transition-colors duration-150">Registrarse</Link></li>
              <li><Link to="/profile" className="text-sm text-gray-600 hover:text-black transition-colors duration-150">Mi Perfil</Link></li>
              <li><Link to="/orders" className="text-sm text-gray-600 hover:text-black transition-colors duration-150">Mis Pedidos</Link></li>
              <li><Link to="/wishlist" className="text-sm text-gray-600 hover:text-black transition-colors duration-150">Lista de Deseos</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Contacto</h4>
            <address className="not-italic space-y-2">
              <p className="text-sm text-gray-600">psgmoños@gmail.com</p>
              <p className="text-sm text-gray-600">(123) 456-7890</p>
              <p className="text-sm text-gray-600">Cajamarca, Tolima, Colombia</p>
            </address>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Facebook" className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all duration-150">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all duration-150">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} PSG SHOP. Todos los derechos reservados.</p>
          <p className="text-xs text-gray-400">Cajamarca, Tolima · Colombia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;