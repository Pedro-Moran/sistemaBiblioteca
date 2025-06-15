# Constancias Module Guide

This document describes how to use the **Constancias** feature (`main/constancias/impresion`).

## Overview

- **Black print button** – the student has no pending materials. Prints the certificate **"CONSTANCIA DE NO ADEUDAR MATERIALES DE BIBLIOTECA Y EQUIPOS DE COMPUTO"**. Recommended use: **Solicitud**.
- **Gray print button** – the student has pending or overdue materials. Prints **"RELACION DE MATERIALES PENDIENTES POR REGULARIZAR"**. Recommended use: **Disposición administrativa**.
- **View Information** – opens a preview without assigning a constancia number or allowing export/print. Use it to check the document before printing.

## Printing Steps

1. Click the printer icon next to the desired record.
2. In the dialog, select the reason for printing:
   - *Error u omisión*
   - *Solicitud* (requires entering the request number: two-digit branch code followed by eight-digit sequential number)
   - *Disposición administrativa*
3. Enter a short description explaining the print request.
4. Press **Aceptar** to generate the document:
   - If the student has no pending materials, the system generates the "Constancia de no adeudar".
   - Otherwise, it generates the list of pending materials.
