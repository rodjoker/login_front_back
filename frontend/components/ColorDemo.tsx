// components/ColorDemo.tsx - Componente de demostración de la librería de colores
import React from 'react';
import { colors } from '@/lib/colors';
import Button from './Button';
import Card from './Card';

const ColorDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: colors.foregroundColor }}
        >
          Librería de Colores - Demostración
        </h1>
        <p 
          className="text-lg"
          style={{ color: colors.foregroundSecondary }}
        >
          Todos los colores se centralizan en un solo lugar para fácil mantenimiento
        </p>
      </div>

      {/* Demostración de Botones */}
      <Card title="Botones con Colores Centralizados">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Botón Principal</Button>
            <Button variant="secondary">Botón Secundario</Button>
            <Button variant="success">Éxito</Button>
            <Button variant="danger">Peligro</Button>
            <Button variant="warning">Advertencia</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="sm">Pequeño</Button>
            <Button variant="primary" size="md">Mediano</Button>
            <Button variant="primary" size="lg">Grande</Button>
          </div>
        </div>
      </Card>

      {/* Demostración de Tarjetas */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Tarjeta Normal" variant="default">
          <p style={{ color: colors.foregroundSecondary }}>
            Esta es una tarjeta normal con los colores base del sistema.
          </p>
        </Card>
        
        <Card title="Tarjeta de Éxito" variant="success">
          <p style={{ color: colors.foregroundColor }}>
            Operación completada exitosamente.
          </p>
        </Card>
        
        <Card title="Tarjeta de Error" variant="error">
          <p style={{ color: colors.foregroundColor }}>
            Ha ocurrido un error en la operación.
          </p>
        </Card>
        
        <Card title="Tarjeta de Información" variant="info">
          <p style={{ color: colors.foregroundColor }}>
            Información importante para el usuario.
          </p>
        </Card>
      </div>

      {/* Paleta de Colores */}
      <Card title="Paleta de Colores Principales">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Colores Principales */}
          <div className="space-y-2">
            <h4 className="font-semibold" style={{ color: colors.foregroundColor }}>Principales</h4>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.primaryColor, borderColor: colors.borderColor }}
              title="Color Primario"
            ></div>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.secondaryColor, borderColor: colors.borderColor }}
              title="Color Secundario"
            ></div>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.accentColor, borderColor: colors.borderColor }}
              title="Color de Acento"
            ></div>
          </div>

          {/* Colores de Botones */}
          <div className="space-y-2">
            <h4 className="font-semibold" style={{ color: colors.foregroundColor }}>Botones</h4>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.buttonColorPrincipal, borderColor: colors.borderColor }}
              title="Botón Principal"
            ></div>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.buttonColorSuccess, borderColor: colors.borderColor }}
              title="Botón Éxito"
            ></div>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.buttonColorDanger, borderColor: colors.borderColor }}
              title="Botón Peligro"
            ></div>
          </div>

          {/* Estados */}
          <div className="space-y-2">
            <h4 className="font-semibold" style={{ color: colors.foregroundColor }}>Estados</h4>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.colorSuccess, borderColor: colors.borderColor }}
              title="Éxito"
            ></div>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.colorWarning, borderColor: colors.borderColor }}
              title="Advertencia"
            ></div>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.colorError, borderColor: colors.borderColor }}
              title="Error"
            ></div>
          </div>

          {/* Grises */}
          <div className="space-y-2">
            <h4 className="font-semibold" style={{ color: colors.foregroundColor }}>Grises</h4>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.gray200, borderColor: colors.borderColor }}
              title="Gris Claro"
            ></div>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.gray500, borderColor: colors.borderColor }}
              title="Gris Medio"
            ></div>
            <div 
              className="h-12 rounded border"
              style={{ backgroundColor: colors.gray700, borderColor: colors.borderColor }}
              title="Gris Oscuro"
            ></div>
          </div>
        </div>
      </Card>

      {/* Instrucciones de Uso */}
      <Card title="Cómo Usar la Librería de Colores">
        <div className="space-y-4" style={{ color: colors.foregroundSecondary }}>
          <div>
            <h5 className="font-semibold mb-2" style={{ color: colors.foregroundColor }}>
              1. Importar los colores:
            </h5>
            <code className="bg-gray-100 p-2 rounded block">
              {"import { colors } from '@/lib/colors';"}
            </code>
          </div>
          
          <div>
            <h5 className="font-semibold mb-2" style={{ color: colors.foregroundColor }}>
              2. Usar en componentes:
            </h5>
            <code className="bg-gray-100 p-2 rounded block">
              style={`{{ backgroundColor: colors.buttonColorPrincipal }}`}
            </code>
          </div>
          
          <div>
            <h5 className="font-semibold mb-2" style={{ color: colors.foregroundColor }}>
              3. Cambiar colores globalmente:
            </h5>
            <p>
              Edita las variables CSS en <code>app/globals.css</code> o los valores en <code>lib/colors.ts</code>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ColorDemo;