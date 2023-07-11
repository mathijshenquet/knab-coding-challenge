
/**
 * A task to be run
 */
export interface Task {
    name: string,
    /**
     * Interval to run the task at in ms
     */
    interval: number,
    /** 
     * Running the task
     * @returns whether to continue with this task
     */
    run(): Promise<boolean>,
}

/**
 * An abstract interface for scheduling tasks
 */
export interface Scheduler {
    schedule(task: Task) : void
}


/**
 * Simple timeout scheduler
 */
export class TimeoutScheduler implements Scheduler {
    schedule(task: Task): void {
        console.log(`Scheduler: Running task ${task.name} in ${task.interval} ms`);

        setTimeout(async () => {
            let result = await task.run();

            if(result){
                this.schedule(task);
            }
        }, task.interval)
    }
}