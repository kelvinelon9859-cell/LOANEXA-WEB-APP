import { NextResponse } from 'next/server';

// GET: Fetch a single application by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Replace with your actual database fetch query
    // Example (Prisma): const app = await prisma.application.findUnique({ where: { id }, include: { users: true } });
    
    // Placeholder response for demonstration
    const mockDbFetch = {
      id: id,
      income: 85000,
      loan_amount: 15000,
      loan_term_months: 36,
      loan_purpose: 'Debt Consolidation',
      status: 'pending',
      created_at: new Date().toISOString(),
      users: {
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '555-0199',
        state: 'NY',
      }
    };

    if (!mockDbFetch) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(mockDbFetch);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update the status of the application (Approve/Reject)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!['approved', 'rejected', 'pending'].includes(status?.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
    }

    // TODO: Replace with your actual database update query
    // Example (Prisma): 
    // const updatedApp = await prisma.application.update({
    //   where: { id },
    //   data: { status: status.toLowerCase() }
    // });

    return NextResponse.json({ success: true, message: `Application ${status}` });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Failed to update application status' }, { status: 500 });
  }
}