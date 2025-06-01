
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Fonctionnalité en développement",
      description: "L'accès administrateur sera disponible dans une version future.",
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto pb-20">
        <Button 
          onClick={handleBack} 
          variant="outline" 
          className="mb-4 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Admin</h1>
          <p className="text-gray-600">Accès réservé à l'administrateur</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Connexion Administrateur</CardTitle>
            <CardDescription>
              Veuillez vous connecter pour gérer le dictionnaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input id="username" placeholder="Entrez votre nom d'utilisateur" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input id="password" type="password" placeholder="Entrez votre mot de passe" />
                </div>
                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                  Se connecter
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;
