
import squatImg from "@assets/stock_images/man_doing_barbell_sq_cc9acf2f.jpg";
import rdlImg from "@assets/stock_images/man_doing_romanian_d_bcaeeb8d.jpg";
import ohpImg from "@assets/stock_images/man_doing_overhead_p_37700aa3.jpg";
import pullupImg from "@assets/stock_images/man_doing_weighted_p_9e1f63da.jpg";
import rowImg from "@assets/stock_images/person_doing_rowing__13abd3a0.jpg";
import swingImg from "@assets/stock_images/person_doing_kettleb_548c7c37.jpg";
import boxJumpImg from "@assets/stock_images/person_doing_box_jum_64e5138c.jpg";
import burpeeImg from "@assets/stock_images/person_doing_burpees_cd8df69e.jpg";
import thoracicImg from "@assets/stock_images/person_doing_thoraci_08fb0201.jpg";
import hipImg from "@assets/stock_images/man_doing_hip_mobili_674c5330.jpg";
import ankleImg from "@assets/stock_images/person_doing_ankle_d_f151f55d.jpg";

export interface ExerciseDef {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  image: string;
  youtubeId?: string;
  description: string;
  isCardio?: boolean;
  category?: "push" | "pull" | "legs" | "core" | "cardio" | "mobility";
}

export const EXERCISE_DATABASE: ExerciseDef[] = [
  { 
    name: "Barbell Squat", 
    sets: "3-4", 
    reps: "6-8", 
    rest: "3m", 
    image: squatImg, 
    youtubeId: "R2dMsNhN3DE",
    description: "Keep chest up, core tight. Break at hips and knees simultaneously. Drive through mid-foot.",
    category: "legs"
  },
  { 
    name: "Romanian Deadlift", 
    sets: "3", 
    reps: "8-10", 
    rest: "2m", 
    image: rdlImg,
    youtubeId: "JCXUYuzwNrM",
    description: "Hinge at the hips, keeping legs slightly bent. Lower bar while keeping it close to shins. Feel the stretch in hamstrings.",
    category: "legs"
  },
  { 
    name: "Overhead Press", 
    sets: "3", 
    reps: "8-10", 
    rest: "2m", 
    image: ohpImg,
    youtubeId: "j7ULT6dznNc",
    description: "Strict press from collarbone to lockout. Keep core braced and glutes squeezed. Don't arch lower back.",
    category: "push"
  },
  { 
    name: "Pull-ups", 
    sets: "3", 
    reps: "AMRAP", 
    rest: "2m", 
    image: pullupImg,
    youtubeId: "eGo4IYlbE5g",
    description: "Full range of motion. Chin over bar at top, full hang at bottom. Control the descent.",
    category: "pull"
  },
  { 
    name: "Bench Press", 
    sets: "3-4", 
    reps: "6-8", 
    rest: "3m", 
    image: ohpImg,
    youtubeId: "SCVCLChPQFY",
    description: "Lower bar to mid-chest with controlled tempo. Press up explosively. Keep shoulder blades pinched.",
    category: "push"
  },
  { 
    name: "Barbell Row", 
    sets: "3", 
    reps: "8-10", 
    rest: "2m", 
    image: pullupImg,
    youtubeId: "FWJR5Ve8bnQ",
    description: "Hinge forward at hips, pull bar to lower chest. Squeeze shoulder blades at top. Control the negative.",
    category: "pull"
  },
  { 
    name: "Leg Press", 
    sets: "3", 
    reps: "10-12", 
    rest: "2m", 
    image: squatImg,
    youtubeId: "IZxyjW7MPJQ",
    description: "Place feet shoulder-width on platform. Lower until thighs are parallel. Push through heels.",
    category: "legs"
  },
  { 
    name: "Dumbbell Lunges", 
    sets: "3", 
    reps: "10/side", 
    rest: "90s", 
    image: squatImg,
    youtubeId: "D7KaRcUTQeE",
    description: "Step forward, lower back knee toward floor. Keep torso upright. Drive through front heel.",
    category: "legs"
  },
  { 
    name: "Incline Dumbbell Press", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: ohpImg,
    youtubeId: "8iPEnn-ltC8",
    description: "Set bench to 30-45 degrees. Press dumbbells up and together. Lower with control.",
    category: "push"
  },
  { 
    name: "Lat Pulldown", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: pullupImg,
    youtubeId: "CAwf7n6Luuc",
    description: "Pull bar to upper chest while squeezing lats. Control the return. Avoid using momentum.",
    category: "pull"
  },
  { 
    name: "Deadlift", 
    sets: "3-4", 
    reps: "5-6", 
    rest: "3m", 
    image: rdlImg,
    youtubeId: "op9kVnSso6Q",
    description: "Hinge at hips, keep back flat. Drive through heels. Lockout with glutes, not lower back.",
    category: "legs"
  },
  { 
    name: "Dumbbell Shoulder Press", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: ohpImg,
    youtubeId: "qEwKCR5JCog",
    description: "Press dumbbells overhead from shoulder height. Keep core engaged throughout.",
    category: "push"
  },
  { 
    name: "Cable Row", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: pullupImg,
    youtubeId: "GZbfZ033f74",
    description: "Sit upright, pull handle to lower chest. Squeeze shoulder blades. Return with control.",
    category: "pull"
  },
  { 
    name: "Bulgarian Split Squat", 
    sets: "3", 
    reps: "8/side", 
    rest: "90s", 
    image: squatImg,
    youtubeId: "2C-uNgKwPLE",
    description: "Rear foot elevated on bench. Lower until front thigh is parallel. Push through front heel.",
    category: "legs"
  },
  { 
    name: "Dips", 
    sets: "3", 
    reps: "AMRAP", 
    rest: "2m", 
    image: ohpImg,
    youtubeId: "2z8JmcrW-As",
    description: "Lower until upper arms are parallel to floor. Push up to full lockout. Keep core tight.",
    category: "push"
  },
  { 
    name: "Face Pulls", 
    sets: "3", 
    reps: "15-20", 
    rest: "60s", 
    image: pullupImg,
    youtubeId: "rep-qVOkqgk",
    description: "Pull rope to face level with elbows high. Squeeze rear delts. Great for posture.",
    category: "pull"
  },
  { 
    name: "Row Erg Intervals", 
    sets: "10", 
    reps: "500m", 
    rest: "1:1", 
    image: rowImg,
    youtubeId: "zQ82RYIFLN8",
    description: "Drive with legs, then swing body, then pull arms. Reverse on recovery. Maintain consistent stroke rate.",
    isCardio: true,
    category: "cardio"
  },
  { 
    name: "Kettlebell Swings", 
    sets: "5", 
    reps: "20", 
    rest: "1m", 
    image: swingImg,
    youtubeId: "YSxHifyI6s8",
    description: "Explosive hip hinge. Snap hips forward to propel bell. Arms act as ropes, not movers.",
    category: "cardio"
  },
  { 
    name: "Box Jumps", 
    sets: "4", 
    reps: "12", 
    rest: "90s", 
    image: boxJumpImg,
    youtubeId: "52r_Ul5k03g",
    description: "Soft landing. Stand tall at top. Step down, do not rebound jump unless advanced.",
    category: "cardio"
  },
  { 
    name: "Burpees", 
    sets: "3", 
    reps: "15", 
    rest: "60s", 
    image: burpeeImg,
    youtubeId: "dZgVxmf6jkA",
    description: "Chest to floor. Explosive jump up. Clap behind head. Maintain pace.",
    category: "cardio"
  },
  { 
    name: "Battle Ropes", 
    sets: "4", 
    reps: "30s", 
    rest: "30s", 
    image: swingImg,
    youtubeId: "oF9PN-HBB_Y",
    description: "Alternate arms in wave pattern. Keep core braced. Maintain consistent rhythm.",
    category: "cardio"
  },
  { 
    name: "Mountain Climbers", 
    sets: "4", 
    reps: "30s", 
    rest: "30s", 
    image: burpeeImg,
    youtubeId: "nmwgirgXLYM",
    description: "High plank position. Alternate driving knees to chest. Keep hips low and stable.",
    category: "cardio"
  },
  { 
    name: "Plank", 
    sets: "3", 
    reps: "60s", 
    rest: "30s", 
    image: burpeeImg,
    youtubeId: "ASdvN_XEl_c",
    description: "Forearms and toes on ground. Keep body in straight line. Engage core throughout.",
    category: "core"
  },
  { 
    name: "Dead Bug", 
    sets: "3", 
    reps: "10/side", 
    rest: "30s", 
    image: hipImg,
    youtubeId: "I5xbsA71v1A",
    description: "Lie on back, extend opposite arm and leg. Keep lower back pressed to floor.",
    category: "core"
  },
  { 
    name: "Thoracic Rotation", 
    sets: "2", 
    reps: "10/side", 
    rest: "-", 
    image: thoracicImg,
    youtubeId: "SB5gsT6X5Vk",
    description: "Open up the chest and upper back. Follow hand with eyes. Breathe into the stretch.",
    category: "mobility"
  },
  { 
    name: "Hip 90/90", 
    sets: "2", 
    reps: "60s/side", 
    rest: "-", 
    image: hipImg,
    youtubeId: "8p6FtlqpAYg",
    description: "Front leg at 90 degrees, back leg at 90 degrees. Lean forward with flat back for external rotation stretch.",
    category: "mobility"
  },
  { 
    name: "Ankle Dorsiflexion", 
    sets: "2", 
    reps: "15/side", 
    rest: "-", 
    image: ankleImg,
    youtubeId: "IikP_teeLkI",
    description: "Drive knee over toe while keeping heel planted. Use bodyweight or weight to increase range.",
    category: "mobility"
  },
  { 
    name: "World's Greatest Stretch", 
    sets: "2", 
    reps: "5/side", 
    rest: "-", 
    image: hipImg,
    youtubeId: "u-8d9IIeaXA",
    description: "Lunge position, rotate torso toward front leg. Reach arm overhead. Great full-body mobility.",
    category: "mobility"
  },
];

export const WORKOUT_TEMPLATES = {
  pushPullLegs: [
    { name: "Push A", focus: ["push", "core"] },
    { name: "Pull A", focus: ["pull", "core"] },
    { name: "Legs A", focus: ["legs", "core"] },
    { name: "Push B", focus: ["push", "core"] },
    { name: "Pull B", focus: ["pull", "core"] },
    { name: "Legs B", focus: ["legs", "core"] },
  ],
  upperLower: [
    { name: "Upper A", focus: ["push", "pull"] },
    { name: "Lower A", focus: ["legs", "core"] },
    { name: "Upper B", focus: ["push", "pull"] },
    { name: "Lower B", focus: ["legs", "core"] },
  ],
  fullBody: [
    { name: "Full Body A", focus: ["push", "pull", "legs"] },
    { name: "Full Body B", focus: ["push", "pull", "legs"] },
    { name: "Full Body C", focus: ["push", "pull", "legs"] },
  ],
  conditioning: [
    { name: "Cardio", focus: ["cardio"] },
    { name: "HIIT", focus: ["cardio", "core"] },
  ],
  recovery: [
    { name: "Mobility", focus: ["mobility"] },
  ]
};

export function getExercisesByCategory(category: string): ExerciseDef[] {
  return EXERCISE_DATABASE.filter(ex => ex.category === category);
}

export function shuffleArray<T>(array: T[], seed?: number): T[] {
  const result = [...array];
  let currentIndex = result.length;
  let seedValue = seed ?? 0;
  const random = seed !== undefined 
    ? () => {
        seedValue = (seedValue * 9301 + 49297) % 233280;
        return seedValue / 233280;
      }
    : Math.random;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
  }
  return result;
}

export const ALTERNATIVES: Record<string, string[]> = {
  "Barbell Squat": ["Goblet Squat", "Leg Press", "Bulgarian Split Squat"],
  "Romanian Deadlift": ["Hamstring Curl", "Kettlebell Swing", "Good Morning"],
  "Overhead Press": ["Dumbbell Press", "Landmine Press", "Push-ups"],
  "Pull-ups": ["Lat Pulldown", "Inverted Row", "Dumbbell Row"],
  "Bench Press": ["Dumbbell Bench Press", "Push-ups", "Floor Press"],
  "Barbell Row": ["Dumbbell Row", "Cable Row", "T-Bar Row"],
  "Deadlift": ["Trap Bar Deadlift", "Romanian Deadlift", "Hip Thrust"],
  "Row Erg Intervals": ["Air Bike", "Treadmill Sprints", "Jump Rope"],
  "Kettlebell Swings": ["Broad Jumps", "Clean & Press", "Medicine Ball Slams"],
  "Box Jumps": ["Step-ups", "Jump Squats", "Tuck Jumps"],
  "Burpees": ["Mountain Climbers", "Thrusters", "Bear Crawls"],
  "Thoracic Rotation": ["Cat-Cow", "Open Book", "Thread the Needle"],
  "Hip 90/90": ["Pigeon Pose", "Frog Stretch", "Couch Stretch"],
  "Ankle Dorsiflexion": ["Calf Stretch", "Down Dog", "Tibialis Raise"]
};

export const MOCK_EXERCISES: Record<string, ExerciseDef[]> = {
  strength: EXERCISE_DATABASE.filter(ex => ["push", "pull", "legs"].includes(ex.category || "")),
  conditioning: EXERCISE_DATABASE.filter(ex => ex.category === "cardio"),
  mobility: EXERCISE_DATABASE.filter(ex => ex.category === "mobility"),
};
