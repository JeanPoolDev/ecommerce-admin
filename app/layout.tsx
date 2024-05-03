import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from "@/providers/modal-provides";
import { ToasterProvider } from "@/providers/toast-provider";


const inter = Inter({ subsets: ["latin"] });

const localization = {
  signUp: {
    start: {
      title: 'Crea tu cuenta',
      subtitle: 'para continuar a {{applicationName}}',
      actionText: '¿Tienes una Cuenta?',
      actionLink: 'Iniciar Sesión',
    },
    emailLink: {
      title: 'Verifica tu Email',
      subtitle: 'para continuar a {{applicationName}}',
      formTitle: 'Verificar Link',
      formSubtitle: 'Utilice el enlace de verificación enviado a su dirección de correo electrónico',
      resendButton: "¿No recibiste un enlace? Reenviar",
      verified: {
        title: 'Registrado exitosamente',
      },
      loading: {
        title: 'Registrarse...  ',
      },
      verifiedSwitchTab: {
        title: 'Correo electrónico verificado exitosamente',
        subtitle: 'Regrese a la pestaña recién abierta para continuar',
        subtitleNewTab: 'Volver a la pestaña anterior para continuar',
      },
    },
    emailCode: {
      title: 'Verifica tu Email',
      subtitle: 'para continuar a {{applicationName}}',
      formTitle: 'Código de verificación',
      formSubtitle: 'Ingrese el código de verificación enviado a su dirección de correo electrónico',
      resendButton: "¿No recibiste un código? Reenviar",
    },
    phoneCode: {
      title: 'Verifica tu teléfono',
      subtitle: 'para continuar a {{applicationName}}',
      formTitle: 'Código de verificación',
      formSubtitle: 'Ingresa el código de verificación enviado a tu número de teléfono',
      resendButton: "¿No recibiste un código? Reenviar",
    },
    continue: {
      title: 'Complete los campos faltantes',
      subtitle: 'para continuar a {{applicationName}}',
      actionText: '¿Tienes una cuenta?',
      actionLink: 'Iniciar Sesión',
    },
  },
  signIn: {
    start: {
      title: 'Iniciar Sesión',
      subtitle: 'para continuar a {{applicationName}}',
      actionText: '¿No Tienes Cuenta?',
      actionLink: 'Crear Cuenta',
    },
    // emailLink: {
    //   title: 'Verifica tu Email',
    //   subtitle: 'para continuar a {{applicationName}}',
    //   formTitle: 'Verificar Link',
    //   formSubtitle: 'Utilice el enlace de verificación enviado a su dirección de correo electrónico',
    //   resendButton: "¿No recibiste un enlace? Reenviar",
    //   verified: {
    //     title: 'Registrado exitosamente',
    //   },
    //   loading: {
    //     title: 'Registrarse...  ',
    //   },
    //   verifiedSwitchTab: {
    //     title: 'Correo electrónico verificado exitosamente',
    //     subtitle: 'Regrese a la pestaña recién abierta para continuar',
    //     subtitleNewTab: 'Volver a la pestaña anterior para continuar',
    //   },
    // },
    // emailCode: {
    //   title: 'Verifica tu Email',
    //   subtitle: 'para continuar a {{applicationName}}',
    //   formTitle: 'Código de verificación',
    //   formSubtitle: 'Ingrese el código de verificación enviado a su dirección de correo electrónico',
    //   resendButton: "¿No recibiste un código? Reenviar",
    // },
    // continue: {
    //   title: 'Complete los campos faltantes',
    //   subtitle: 'para continuar a {{applicationName}}',
    //   actionText: '¿Tienes una cuenta?',
    //   actionLink: 'Iniciar Sesión',
    // },
  },
};

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider localization={localization}>
      <html lang="es">
        <body className={inter.className}>
          <ToasterProvider />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
