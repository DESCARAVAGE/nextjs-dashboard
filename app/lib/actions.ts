'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import postgres from 'postgres';
import { redirect } from 'next/navigation';

//Création du lien avec la BDD
const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

//Définition de l'objet attendu dans le formData
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

//Omission des champs id et date
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    // console.log(typeof rawFormData.amount);

    //Convertission en cents
    const amountInCents = amount * 100;
    //Définition du format de date
    const date = new Date().toISOString().split('T')[0];

    //Insertion en BDD
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}