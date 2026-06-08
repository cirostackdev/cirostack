import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";
import { auth } from "@/auth";
import React from "react";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  header: { marginBottom: 30 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#666" },
  meta: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  metaBlock: {},
  metaLabel: { fontSize: 8, color: "#999", marginBottom: 2 },
  metaValue: { fontSize: 10 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    fontWeight: "bold",
  },
  row: { flexDirection: "row", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#eee" },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: "center" },
  col3: { flex: 1, textAlign: "right" },
  col4: { flex: 1, textAlign: "right" },
  totalRow: { flexDirection: "row", paddingTop: 10, marginTop: 4 },
  totalLabel: { flex: 5, textAlign: "right", fontWeight: "bold", fontSize: 12 },
  totalValue: { flex: 1, textAlign: "right", fontWeight: "bold", fontSize: 12 },
  paidNote: { fontSize: 10, fontWeight: "bold", marginTop: 10 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
  },
});

function InvoiceDocument({ invoice, lineItems }: { invoice: any; lineItems: any[] }) {
  const fmt = (amount: number) => `${invoice.currency} ${(amount / 100).toFixed(2)}`;

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.title }, "INVOICE"),
        React.createElement(Text, { style: styles.subtitle }, invoice.number)
      ),
      // Meta
      React.createElement(
        View,
        { style: styles.meta },
        React.createElement(
          View,
          { style: styles.metaBlock },
          React.createElement(Text, { style: styles.metaLabel }, "BILL TO"),
          React.createElement(Text, { style: styles.metaValue }, invoice.client.name || invoice.client.email),
          invoice.client.company
            ? React.createElement(Text, { style: styles.metaValue }, invoice.client.company)
            : null,
          React.createElement(Text, { style: styles.metaValue }, invoice.client.email)
        ),
        React.createElement(
          View,
          { style: styles.metaBlock },
          React.createElement(Text, { style: styles.metaLabel }, "DATE"),
          React.createElement(Text, { style: styles.metaValue }, invoice.createdAt.toISOString().slice(0, 10)),
          invoice.dueDate
            ? React.createElement(
                View,
                null,
                React.createElement(Text, { style: { ...styles.metaLabel, marginTop: 8 } }, "DUE DATE"),
                React.createElement(Text, { style: styles.metaValue }, invoice.dueDate.toISOString().slice(0, 10))
              )
            : null
        ),
        React.createElement(
          View,
          { style: styles.metaBlock },
          React.createElement(Text, { style: styles.metaLabel }, "STATUS"),
          React.createElement(Text, { style: styles.metaValue }, invoice.status.toUpperCase()),
          invoice.project
            ? React.createElement(
                View,
                null,
                React.createElement(Text, { style: { ...styles.metaLabel, marginTop: 8 } }, "PROJECT"),
                React.createElement(Text, { style: styles.metaValue }, invoice.project.title)
              )
            : null
        )
      ),
      // Items
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Items"),
        React.createElement(
          View,
          { style: styles.headerRow },
          React.createElement(Text, { style: styles.col1 }, "Description"),
          React.createElement(Text, { style: styles.col2 }, "Qty"),
          React.createElement(Text, { style: styles.col3 }, "Unit Price"),
          React.createElement(Text, { style: styles.col4 }, "Amount")
        ),
        ...lineItems.map((item: any, i: number) =>
          React.createElement(
            View,
            { style: styles.row, key: i },
            React.createElement(Text, { style: styles.col1 }, item.description),
            React.createElement(Text, { style: styles.col2 }, String(item.qty)),
            React.createElement(Text, { style: styles.col3 }, fmt(item.unitPrice)),
            React.createElement(Text, { style: styles.col4 }, fmt(item.qty * item.unitPrice))
          )
        ),
        React.createElement(
          View,
          { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, "TOTAL:"),
          React.createElement(Text, { style: styles.totalValue }, fmt(invoice.amount))
        )
      ),
      // Paid note
      invoice.paidAt
        ? React.createElement(
            View,
            { style: styles.section },
            React.createElement(
              Text,
              { style: styles.paidNote },
              `PAID on ${invoice.paidAt.toISOString().slice(0, 10)}`
            ),
            invoice.paymentRef
              ? React.createElement(Text, { style: styles.subtitle }, `Ref: ${invoice.paymentRef}`)
              : null
          )
        : null,
      // Footer
      React.createElement(Text, { style: styles.footer }, "Generated by CiroStack")
    )
  );
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  const clientSession = await clientAuth();
  const adminSession = await auth();
  const clientId = clientSession?.user ? (clientSession.user as any).id : null;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        ...(adminSession?.user ? {} : { clientId }),
      },
      include: {
        client: true,
        project: { select: { title: true } },
      },
    });
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const lineItems = invoice.lineItems as { description: string; qty: number; unitPrice: number }[];

    const pdfBuffer = await renderToBuffer(
      InvoiceDocument({ invoice, lineItems }) as any
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.number}.pdf"`,
      },
    });
  } catch (err) {
    console.error("[GET /api/portal/invoices/[id]/pdf]", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
