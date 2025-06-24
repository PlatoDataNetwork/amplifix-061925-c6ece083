
const StatsSection = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="bg-card p-6 rounded-xl border border-border text-center">
          <div className="text-4xl font-bold text-highlight-blue">500+</div>
          <div className="text-muted-foreground">Companies Served</div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border text-center">
          <div className="text-4xl font-bold text-highlight-blue">98%</div>
          <div className="text-muted-foreground">Client Satisfaction</div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border text-center">
          <div className="text-4xl font-bold text-highlight-blue">$50B+</div>
          <div className="text-muted-foreground">Market Cap Managed</div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border text-center">
          <div className="text-4xl font-bold text-highlight-blue">24/7</div>
          <div className="text-muted-foreground">AI Monitoring</div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
