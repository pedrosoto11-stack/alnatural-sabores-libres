/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>Restablece tu contraseña en {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Restablece tu contraseña</Heading>
        <Text style={text}>
          Recibimos una solicitud para restablecer tu contraseña en {siteName}. Haz clic en el botón para elegir una nueva contraseña.
        </Text>
        <Button className="dm-btn" style={button} href={confirmationUrl}>
          Cambiar contraseña
        </Button>
        <Text style={footer}>
          Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no se modificará.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '20px 25px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#23252a',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#6b6f78',
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const button = {
  backgroundColor: '#16a34a',
  color: '#ffffff',
  fontSize: '14px',
  border: '1px solid #16a34a',
  borderRadius: '12px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
// Rendered as a text child, which React may HTML-escape: keep this CSS free of >, &, and quotes.
const darkModeCss = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #22c55e !important; color: #ffffff !important; }
  }
  [data-ogsc] .dm-btn { background-color: #22c55e !important; color: #ffffff !important; }
  [data-ogsb] .dm-btn { background-color: #22c55e !important; color: #ffffff !important; }
`
