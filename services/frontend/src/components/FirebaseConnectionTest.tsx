'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function FirebaseConnectionTest() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Firebase Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This component is temporarily disabled while we migrate Firebase functionality to the data service.</p>
      </CardContent>
    </Card>
  );
} 