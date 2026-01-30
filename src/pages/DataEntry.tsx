import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, DollarSign, Building2 } from 'lucide-react';

const DataEntry = () => {
  const { role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && role !== 'administration' && role !== 'admin') {
      navigate('/dashboard');
    }
  }, [role, loading, navigate]);

  const [budgetData, setBudgetData] = useState({
    ministry: '',
    sector: '',
    amount: '',
    fiscal_year: new Date().getFullYear().toString(),
    description: '',
  });

  const [transactionData, setTransactionData] = useState({
    reference: '',
    type: 'decaissement',
    amount: '',
    beneficiary: '',
    description: '',
    supporting_docs: '',
  });

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Budget enregistré",
      description: "Les données budgétaires ont été soumises avec succès",
    });
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Transaction enregistrée",
      description: "La transaction a été soumise avec succès",
    });
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (role !== 'administration' && role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Saisie des Données</h1>
          <p className="text-muted-foreground">
            Interface de saisie pour les administrations publiques
          </p>
        </div>

        <Tabs defaultValue="budget" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="budget">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Saisie Budgétaire
                </CardTitle>
                <CardDescription>
                  Enregistrer les allocations budgétaires et les prévisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBudgetSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ministry">Ministère</Label>
                      <Select
                        value={budgetData.ministry}
                        onValueChange={(value) => setBudgetData({ ...budgetData, ministry: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un ministère" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="education">Éducation Nationale</SelectItem>
                          <SelectItem value="sante">Santé</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sector">Secteur</Label>
                      <Input
                        id="sector"
                        placeholder="Ex: Enseignement primaire"
                        value={budgetData.sector}
                        onChange={(e) => setBudgetData({ ...budgetData, sector: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Montant (FCFA)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0"
                        value={budgetData.amount}
                        onChange={(e) => setBudgetData({ ...budgetData, amount: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fiscal_year">Année fiscale</Label>
                      <Input
                        id="fiscal_year"
                        type="number"
                        value={budgetData.fiscal_year}
                        onChange={(e) => setBudgetData({ ...budgetData, fiscal_year: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Détails sur l'allocation budgétaire..."
                      value={budgetData.description}
                      onChange={(e) => setBudgetData({ ...budgetData, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Enregistrer le Budget
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Enregistrement de Transaction
                </CardTitle>
                <CardDescription>
                  Saisir les transactions financières et décaissements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransactionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reference">Référence</Label>
                      <Input
                        id="reference"
                        placeholder="TRX-2025-XXXX"
                        value={transactionData.reference}
                        onChange={(e) => setTransactionData({ ...transactionData, reference: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={transactionData.type}
                        onValueChange={(value) => setTransactionData({ ...transactionData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="decaissement">Décaissement</SelectItem>
                          <SelectItem value="recette">Recette</SelectItem>
                          <SelectItem value="transfert">Transfert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tx-amount">Montant (FCFA)</Label>
                      <Input
                        id="tx-amount"
                        type="number"
                        placeholder="0"
                        value={transactionData.amount}
                        onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="beneficiary">Bénéficiaire</Label>
                      <Input
                        id="beneficiary"
                        placeholder="Nom du bénéficiaire"
                        value={transactionData.beneficiary}
                        onChange={(e) => setTransactionData({ ...transactionData, beneficiary: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tx-description">Description</Label>
                    <Textarea
                      id="tx-description"
                      placeholder="Détails de la transaction..."
                      value={transactionData.description}
                      onChange={(e) => setTransactionData({ ...transactionData, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supporting_docs">Pièces justificatives (URLs séparées par virgules)</Label>
                    <Input
                      id="supporting_docs"
                      placeholder="https://..."
                      value={transactionData.supporting_docs}
                      onChange={(e) => setTransactionData({ ...transactionData, supporting_docs: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Enregistrer la Transaction
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload de Documents
                </CardTitle>
                <CardDescription>
                  Téléverser les documents justificatifs et rapports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Glisser-déposer vos fichiers ici</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    ou cliquez pour sélectionner des fichiers
                  </p>
                  <Button variant="outline">Parcourir les fichiers</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Formats acceptés: PDF, Excel, Word. Taille max: 10MB par fichier
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DataEntry;
