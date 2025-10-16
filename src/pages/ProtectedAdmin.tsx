import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, UserPlus, Calendar, Mail, Phone, Building, MapPin, LogOut, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const clientSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(100, "El nombre debe tener menos de 100 caracteres"),
  email: z.string().trim().email("Email inválido").max(255, "El email debe tener menos de 255 caracteres"),
  phone: z.string().trim().max(20, "El teléfono debe tener menos de 20 caracteres").optional(),
  company: z.string().trim().max(100, "La empresa debe tener menos de 100 caracteres").optional(),
  city: z.string().trim().max(50, "La ciudad debe tener menos de 50 caracteres").optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  city?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  access_codes: Array<{
    code: string;
    is_active: boolean;
    expires_at?: string;
    created_at: string;
  }>;
}

const ProtectedAdmin: React.FC = () => {
  const { user, isAdmin, isLoading: adminLoading, signOut } = useAdmin();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingClientId, setUpdatingClientId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      city: "",
    },
  });

  const editForm = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      city: "",
    },
  });

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Sesión no válida");
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('list-clients', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) {
        console.error('Error fetching clients:', error);
        toast.error("Error al cargar los clientes");
        return;
      }

      setClients(data.clients || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error al cargar los clientes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchClients();
    }
  }, [user, isAdmin]);

  // If loading auth state, show loading
  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated or not admin, redirect to admin auth
  if (!user || !isAdmin) {
    return <Navigate to="/admin-auth" replace />;
  }

  const updateClientStatus = async (clientId: string, isActive: boolean) => {
    setUpdatingClientId(clientId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Sesión no válida");
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('update-client-status', {
        body: { clientId, isActive },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error updating client status:', error);
        toast.error("Error al actualizar el estado del cliente");
        return;
      }

      toast.success(data.message);
      fetchClients();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error al actualizar el estado del cliente");
    } finally {
      setUpdatingClientId(null);
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Sesión no válida");
        return;
      }
      
      const { data: result, error } = await supabase.functions.invoke('create-client', {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          city: data.city || null,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating client:', error);
        const errorMessage = result?.error || result?.message || "Error al crear el cliente";
        toast.error(errorMessage);
        return;
      }

      toast.success(`Cliente creado exitosamente. Código de acceso: ${result.accessCode}`);
      form.reset();
      fetchClients();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error al crear el cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    editForm.reset({
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      company: client.company || "",
      city: client.city || "",
    });
    setIsEditDialogOpen(true);
  };

  const onEditSubmit = async (data: ClientFormData) => {
    if (!editingClient) return;
    
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Sesión no válida");
        return;
      }
      
      const { data: result, error } = await supabase.functions.invoke('update-client', {
        body: {
          clientId: editingClient.id,
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          city: data.city || null,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error updating client:', error);
        const errorMessage = result?.error || result?.message || "Error al actualizar el cliente";
        toast.error(errorMessage);
        return;
      }

      toast.success("Cliente actualizado exitosamente");
      setIsEditDialogOpen(false);
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error al actualizar el cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
              <p className="text-muted-foreground">Gestiona clientes y códigos de acceso</p>
            </div>
            <Button onClick={signOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>

          {/* Add Client Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Agregar Nuevo Cliente
              </CardTitle>
              <CardDescription>
                Completa el formulario para crear un nuevo cliente y generar su código de acceso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre completo del cliente" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="cliente@ejemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="+58 412 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre de la empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <Input placeholder="Ciudad del cliente" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando cliente...
                      </>
                    ) : (
                      "Crear Cliente"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Clients List Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Clientes Registrados ({clients.length})
              </CardTitle>
              <CardDescription>
                Lista de todos los clientes registrados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Cargando clientes...
                </div>
              ) : clients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay clientes registrados
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Código de Acceso</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha de Registro</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">
                            <div className="space-y-1">
                              <div>{client.name}</div>
                              {client.city && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {client.city}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {client.email}
                              </div>
                              {client.phone && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  {client.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {client.company ? (
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {client.company}
                              </div>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {client.access_codes[0] ? (
                              <Badge variant="secondary" className="font-mono">
                                {client.access_codes[0].code}
                              </Badge>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={client.is_active}
                                onCheckedChange={(checked) => updateClientStatus(client.id, checked)}
                                disabled={updatingClientId === client.id}
                              />
                              <Badge variant={client.is_active ? "default" : "secondary"}>
                                {client.is_active ? "Activo" : "Inactivo"}
                              </Badge>
                              {updatingClientId === client.id && (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {new Date(client.created_at).toLocaleDateString('es-ES')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(client)}
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica la información del cliente
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo del cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="cliente@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+58 412 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre de la empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ciudad del cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProtectedAdmin;