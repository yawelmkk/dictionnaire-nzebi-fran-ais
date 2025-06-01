import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export function ContactUs() {
  useEffect(() => {
    // Essayer d'enregistrer le protocole mailto
    try {
      navigator.registerProtocolHandler(
        'mailto',
        'mailto:%s'
      )
    } catch (error) {
      console.log('Protocol handler registration failed:', error)
    }
  }, [])

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const email = 'contact@nzebi-dictionary.com'
    const mailtoUrl = `mailto:${email}`

    // Méthode 1: window.location.href
    try {
      window.location.href = mailtoUrl
    } catch (error) {
      console.log('Method 1 failed:', error)
    }

    // Méthode 2: window.open avec _self
    setTimeout(() => {
      try {
        window.open(mailtoUrl, '_self')
      } catch (error) {
        console.log('Method 2 failed:', error)
      }
    }, 100)

    // Méthode 3: window.open avec _blank
    setTimeout(() => {
      try {
        window.open(mailtoUrl, '_blank')
      } catch (error) {
        console.log('Method 3 failed:', error)
      }
    }, 200)

    // Méthode 4: créer et cliquer sur un lien
    setTimeout(() => {
      try {
        const link = document.createElement('a')
        link.href = mailtoUrl
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.log('Method 4 failed:', error)
      }
    }, 300)
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={handleEmailClick}
    >
      <Mail className="mr-2 h-4 w-4" />
      Contactez-nous
    </Button>
  )
} 