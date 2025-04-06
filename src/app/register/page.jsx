import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserIcon, TrophyIcon } from 'lucide-react';

export default function RegisterSelection() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Registration</CardTitle>
          <CardDescription>
            Please select your registration type
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-6">
          <Link href="/register/athlete" className="w-full">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <UserIcon className="h-6 w-6" />
              <span className="font-medium">Register as Athlete</span>
            </Button>
          </Link>
          
          <Link href="/register/promoter" className="w-full">
            <Button className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <TrophyIcon className="h-6 w-6" />
              <span className="font-medium">Register as Promoter</span>
            </Button>
          </Link>
        </CardContent>
        
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="ml-1 underline underline-offset-2">Log in</Link>
        </CardFooter>
      </Card>
    </div>
  );
}