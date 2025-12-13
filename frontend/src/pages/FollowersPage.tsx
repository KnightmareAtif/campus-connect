import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { friends } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const FollowersPage = () => {
  // Mock followers - in real app would be from club data
  const followers = friends.map(f => ({
    ...f,
    followedSince: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }));

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">Followers</h1>
          <p className="mt-1 text-muted-foreground">
            {followers.length} people are following your club
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {followers.map((follower) => (
            <motion.div
              key={follower.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarImage src={follower.avatar} alt={follower.name} />
                    <AvatarFallback>{follower.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-foreground">{follower.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Followed {follower.followedSince.toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {followers.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No followers yet. Post events to attract followers!</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default FollowersPage;
