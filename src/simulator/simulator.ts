import {Options, OriginalStats, SimulationInput} from './simulator.models.js'

async function simulate(simulation_id: number, original_stats: OriginalStats, options: Options) {
    console.log(`Starting sim ${simulation_id}`)
    const start_time = Date.now();

    let wins = original_stats.wins;
    let ties = original_stats.ties ?? 0;
    let losses = original_stats.losses;
    let battles = original_stats.battles;

    let battle_diff = 0;

    let percent = wins/battles;

    
    while (percent < (options.target_percentage/100) && battle_diff < options.max_simulated_battles) {
        battle_diff += 1;
        battles += 1;
        let rand = Math.random();
        if (rand <= (options.average_tierate / 100))
            ties += 1
        else if (rand <= (options.average_winrate / 100))
            wins += 1
        else
            losses += 1
        
        percent = wins/battles
    }

    console.log(`Ending sim ${simulation_id}`)
    return {
        'original_stats': original_stats,
        'new_stats': {
            'wins': wins,
            'losses': losses,
            'ties': ties,
            'total_battles': battles,
        },
        'battles_simulated': battle_diff,
        'percent': percent,
        'simulation_number': simulation_id,
        'total_time': Date.now() - start_time
    }
}

async function run_threads(num_simulations: number, original_stats: OriginalStats, options: Options) {
    const threads = []
    for (let i = 0; i < num_simulations; i++) {
        console.log(`Starting thread ${i} of ${num_simulations} threads.`)

        threads.push(simulate(i, original_stats, options))
    }

    return await Promise.all(threads)
}

function validate_event(event: SimulationInput) {
    
}

function mean(array: number[]) {
    return array.reduce((acc, v) => acc + v, 0) / array.length
}

export async function handle_event(event: SimulationInput) {
    const t0 = Date.now();

    validate_event(event)

    const total_wins = event.wins;
    const total_battles = event.battles;
    const average_winrate = event.average_winrate;
    const target_percentage = event.target_percentage;

    let max_simulated_battles = total_battles * total_battles

    if (max_simulated_battles < 1000) max_simulated_battles = 1000

    const num_simulations = 1000

    const total_losses = total_battles - total_wins;

    const options = {
        max_simulated_battles: max_simulated_battles,
        average_winrate: average_winrate,
        target_percentage: target_percentage,
        average_tierate: 0
    }

    const original_stats = {
        'wins': total_wins,
        'losses': total_losses,
        'ties': 0,
        'battles': total_battles,
    }

    console.log(`Starting a total of ${num_simulations} threads.`)
    const statistics = await run_threads(num_simulations, original_stats, options)
    console.log(`Finished waiting on a total of ${num_simulations} threads.`)

    const num_diff_battles = statistics.map(stat=>stat.battles_simulated).filter(stat=>!!stat)
    
    const avg_battles_required = mean(num_diff_battles)

    const max_battles_required = Math.max(...num_diff_battles)

    const min_battles_required = Math.min(...num_diff_battles)

    const sim_times = statistics.map(stat=>stat.total_time)
    
    const avg_sim_time = mean(sim_times)

    return {
        total_time: Date.now() - t0,
        average_sim_time: avg_sim_time,
        average_win_rate: average_winrate,
        target_win_rate: target_percentage,
        average_battles_required: avg_battles_required,
        max_battles_required,
        min_battles_required,
        original_information: original_stats,
        num_simulations,
        max_allowed_battles: max_simulated_battles,
        statistics
    }

}

// handle_event({
//     wins: 10260,
//     battles: 20230,
//     average_winrate: 70,
//     target_percentage: 60
// }).then(data => {
//     console.log(data)
// })