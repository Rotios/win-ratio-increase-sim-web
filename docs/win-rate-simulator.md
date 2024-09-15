# Win Rate Simulator
The Win Rate Simulator will help you determine how quickly you can increase your account's win rate to a target percentage.

### Inputs
In order for the simulator to work, you must provide the following parameters:

1. Battles - The number of battles you've fought on your account.
2. Wins - The number of wins you've had.
3. Recent Average Win Rate - You're most recent average win rate. For example, you can use the last 30 or 60 day average win rate if the game you play shows it to you. Or you can try to extrapolate it based on your recent matches. For example, if you believe you win 55% of all your matches, put 55%. 
4. Target Win Rate - The Win Rate you want to achieve. This win rate must be lower than you recent win rate in order for the two to converge. You cannot have an average win rate of 55% and expect to reach 60% target win rate.

> If you play a game where win rate is split based on a particular character or asset, you can use those statistics to determine how quickly you can increase that character or asset's stats. For example, World of Tanks has statistics for each individual tank you play. If you currently have the Leopard 1 with a 50% WR (50 wins / 100 battles) but you've recently been playing at an average of 60% WR (12 / 20 battles), you can plug those values into the calculator to determine how many battles you need to play to increase your WR from 50% to 52%. 

### How Does the Simulator Work?

The simulator creates 1000 play session treads with your originally provided stats. Each thread will then play a certain number of battles until it either reaches your target percentage or a soft cap is reached. This soft cap is in place in order to stop threads from running indefinitely.

To determine whether a battle is considered a win or loss, the simulation generates a random number and checks that the value is less than your recent average win rate. For example, if your average win rate is 60% and the simulation rolls a 50, then that battle is considered a win. If the simulation rolls a 70, it is a loss.

### Output
The output of the simulation will be displayed once the simulation ends.

1. Expected Battles Required - This uses a simple mathematical formula to determine an expected number of battles that would be required to reach your target WR. Keep in mind that this assumes you always achieve your average win rate. 
2. Average Win Rate - The average win rate across all simulated sessions.
2. Average Battles Required - This is the average number of battles that each simulated session performed. This number will differ from the expected battles required due to the nature of randomness. 
3. Average Wins - The average number of wins across all play sessions.
4. Average Losses - The average number of losses across all play sessions.
5. Min Battles Required - The minimum number of battles required to reach the target WR across all play sessions.
6. Max Battles Required - The maximum number of battles required to reach the target WR across all play sessions.

There is also a table with each individual play sessions results. The column results are:
1. Battles Simulated - the number of battles played by this play session.
1. Wins Simulated - the number of battles won in this play session.
1. Losses Simulated - the number of battles lost in this play session.
1. Account Wins - the new number of wins that would show up on your account.
1. Account Losses - the new number of losses that would show up on your account.
1. Account Battles - the new number of battles that would show up on your account.
1. New Avr WR - the new average win rate achieved by this play session.

Use this table to validate the output data and to see how easy or difficult it will be to reach your target win rate due to randomness.

#### Example Simulation

Inputs:
1. Battles - 10
2. Wins - 4 
3. Recent Average Win Rate - 60%
4. Target Win Rate - 55%

Outputs:
1. Expected Battles - 18
2. Average Win Rate - 75
3. Averare Battles Required - 37
4. Average Wins - 26
5. Average Losses - 21
6. Min Battles Required - 4
7. Max Battles Required - 1000

## Future Work

This simulation works great to give users a general overview of how their current performance can positively impact their WR. However, there are still a few issues that can be addressed.

1. Game Sessions that reach the soft cap on the number of battles allowed can drastically bring the average required battles up. In these cases the target percentage is not reached. There has to be a better way to use these simulations.
2. More fine tuning options can be provided to either increase the number of battles per session or increase the number of sessions played at once. 
3. Results could be returned asynchronously for each play sessions in groupss and the data calculated and displayed again as groups of sessions complete. This way the user can see the values change as sessions complete.