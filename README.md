# jpSample

### Animal Planet

> You learn a lot watching things eat.
> -Jack Nicholson, The Departed

Taking the classic beginner programmer example of animal methods a step further, this app seeks to provide a parametric & non-determinstic approach to simulating wildlife ecosystems all in glorious JavaScript.  This simulation consists of three species populations:

	* Plants: Green squares.  Immobile lifeform.  Each lifeform in this population has a given probability to generate progeny.  Although each is assigned a sex, it reproduces regardless of gender.  Takes no food and does not die until eaten.  Provides 100 energy to predator.

	* Gazelles: Blue squares.  Mobile animal.  Feeds off of plants only.  At birth, is assigned random position, and X/Y velocities.  Dies when out of energy (decreases by half a point every fifty milliseconds) or when eaten by predator.  Does not eat if at or above max energy.  Reproduces depending on energy level, gender, and chance once it crosses pathes with another animal of same species and opposite sex.

	* Lions: Red squares.  Mobile animal.  Feeds off of gazelles only.  Also has random physics properties at birth.  Has 300 energy at birth and decreases half a point every animation cycle (50ms).  Reproduces depending on energy level, gender, and chance once it crosses pathes with another animal of same species and opposite sex.

Arbitrary carrying capacity of 500 is applied to all species so as not to exhaust the call stack once a species reaches critical mass.

Uses parasitic inheritance versus prototypal/pseudoclassical patterns typically seen in JavaScript applications.  For example, lion and gazelle objects both inherit from animal which inherit from lifeform via function declarations.

To do:

	*Provide DOM-based control elements to change input parameters at will to visualize how the same environment would play out with different settings (starting population size, repoduction chance, etc).