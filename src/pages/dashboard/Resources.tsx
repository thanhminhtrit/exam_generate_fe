import { motion } from 'framer-motion';
import { BookOpen, File, Link, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const resourceCategories = [
  { name: 'Documents', icon: File, count: 12, color: 'text-blue-500' },
  { name: 'Links', icon: Link, count: 8, color: 'text-green-500' },
  { name: 'Images', icon: Image, count: 24, color: 'text-purple-500' },
  { name: 'Others', icon: BookOpen, count: 5, color: 'text-orange-500' },
];

export default function Resources() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Resources</h1>
        <p className="text-muted-foreground">Teaching materials and references</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resourceCategories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-medium transition-shadow cursor-pointer">
              <CardHeader>
                <category.icon className={`h-8 w-8 ${category.color}`} />
                <CardTitle className="font-heading mt-4">{category.name}</CardTitle>
                <CardDescription>{category.count} items</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="shadow-card">
        <CardContent className="py-16 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-heading font-semibold mb-2">Resource library coming soon</h3>
          <p className="text-muted-foreground mb-6">
            Manage your teaching materials in one place
          </p>
          <Button>Upload Resource</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
