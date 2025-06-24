
const PlatformPreview = () => {
  return (
    <div className="container mx-auto py-16 px-4 relative">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-highlight-blue/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
      
      <div className="relative bg-card rounded-2xl p-6 border border-border shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-muted-foreground text-sm">AmplifiX Dashboard</span>
        </div>
        <div className="bg-background rounded-xl p-8 min-h-[400px] relative overflow-hidden">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <div className="bg-muted rounded-lg h-12 w-full mb-4"></div>
              <div className="space-y-3">
                <div className="bg-muted rounded-lg h-10 w-full"></div>
                <div className="bg-muted rounded-lg h-10 w-full"></div>
                <div className="bg-muted rounded-lg h-10 w-full"></div>
                <div className="bg-muted rounded-lg h-10 w-full"></div>
              </div>
            </div>
            
            <div className="col-span-9">
              <div className="bg-muted rounded-lg h-12 w-full mb-6"></div>
              
              <div className="space-y-5">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/40"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-muted rounded-lg w-1/4 mb-2"></div>
                      <div className="h-2 bg-muted rounded-lg w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-highlight-blue/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default PlatformPreview;
