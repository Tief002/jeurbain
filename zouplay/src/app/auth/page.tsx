'use client'

import { createClient } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Trophy } from 'lucide-react'

export default function AuthPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ZouPlay</h1>
          <p className="text-gray-600">
            Jouez, gagnez des points et débloquez des récompenses
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Adresse email',
                  password_label: 'Mot de passe',
                  email_input_placeholder: 'Votre adresse email',
                  password_input_placeholder: 'Votre mot de passe',
                  button_label: 'S\'inscrire',
                  loading_button_label: 'Inscription...',
                  social_provider_text: 'Se connecter avec {{provider}}',
                  link_text: 'Vous n\'avez pas de compte ? Inscrivez-vous',
                },
                sign_in: {
                  email_label: 'Adresse email',
                  password_label: 'Mot de passe',
                  email_input_placeholder: 'Votre adresse email',
                  password_input_placeholder: 'Votre mot de passe',
                  button_label: 'Se connecter',
                  loading_button_label: 'Connexion...',
                  social_provider_text: 'Se connecter avec {{provider}}',
                  link_text: 'Vous avez déjà un compte ? Connectez-vous',
                },
                magic_link: {
                  email_input_label: 'Adresse email',
                  email_input_placeholder: 'Votre adresse email',
                  button_label: 'Envoyer le lien magique',
                  loading_button_label: 'Envoi...',
                  link_text: 'Envoyer un lien magique par email',
                  check_email_text: 'Vérifiez votre email pour le lien de connexion',
                },
                forgotten_password: {
                  email_label: 'Adresse email',
                  password_label: 'Mot de passe',
                  email_input_placeholder: 'Votre adresse email',
                  button_label: 'Réinitialiser le mot de passe',
                  loading_button_label: 'Envoi...',
                  link_text: 'Mot de passe oublié ?',
                  confirmation_text: 'Vérifiez votre email pour le lien de réinitialisation',
                },
                update_password: {
                  password_label: 'Nouveau mot de passe',
                  password_input_placeholder: 'Votre nouveau mot de passe',
                  button_label: 'Mettre à jour le mot de passe',
                  loading_button_label: 'Mise à jour...',
                },
              },
            }}
            theme="light"
            providers={[]}
            redirectTo={`${process.env.NEXT_PUBLIC_APP_URL}/`}
          />
        </div>

        {/* Features */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Gamepad2 className="w-4 h-4 text-blue-600" />
              </div>
              <span>Mini-jeux</span>
            </div>
            <div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
              </div>
              <span>Points</span>
            </div>
            <div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Gift className="w-4 h-4 text-green-600" />
              </div>
              <span>Récompenses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Import the missing icons
import { Gamepad2, Gift } from 'lucide-react'