
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
  isWarmup?: boolean;
  category?: "push" | "pull" | "legs" | "core" | "cardio" | "mobility" | "warmup";
  muscleGroup?: "chest" | "triceps" | "shoulders" | "back" | "biceps" | "quads" | "hamstrings" | "glutes" | "abs" | "full";
  equipment?: "barbell" | "dumbbell" | "cable" | "machine" | "bodyweight" | "kettlebell" | "cardio_machine";
}

export const EXERCISE_DATABASE: ExerciseDef[] = [
  // WARMUP EXERCISES
  { 
    name: "Arm Circles", 
    sets: "2", 
    reps: "20/direction", 
    rest: "-", 
    image: thoracicImg, 
    youtubeId: "Zln9D0RwxbE",
    description: "Stand tall, extend arms. Make small circles, gradually increasing size. Reverse direction.",
    category: "warmup",
    isWarmup: true,
    muscleGroup: "shoulders",
    equipment: "bodyweight"
  },
  { 
    name: "Band Pull-Aparts", 
    sets: "2", 
    reps: "15-20", 
    rest: "-", 
    image: pullupImg, 
    youtubeId: "fFLEniUWN38",
    description: "Hold band at shoulder width. Pull apart squeezing shoulder blades. Great for upper body warmup.",
    category: "warmup",
    isWarmup: true,
    muscleGroup: "back",
    equipment: "cable"
  },
  { 
    name: "Push-up Plus", 
    sets: "2", 
    reps: "10", 
    rest: "-", 
    image: burpeeImg, 
    youtubeId: "4R5uQN-xhKI",
    description: "Do a push-up, at the top push shoulders further up rounding upper back. Activates serratus.",
    category: "warmup",
    isWarmup: true,
    muscleGroup: "chest",
    equipment: "bodyweight"
  },
  { 
    name: "Light Cardio", 
    sets: "1", 
    reps: "5 min", 
    rest: "-", 
    image: rowImg, 
    youtubeId: "z61FKHc40BE",
    description: "Row, bike, or incline walk at easy pace. Elevate heart rate and warm up muscles before lifting.",
    category: "warmup",
    isWarmup: true,
    isCardio: true,
    muscleGroup: "full",
    equipment: "cardio_machine"
  },
  { 
    name: "Leg Swings", 
    sets: "2", 
    reps: "15/leg", 
    rest: "-", 
    image: hipImg, 
    youtubeId: "1z3T_bKV8EE",
    description: "Hold wall for balance. Swing leg forward and back, then side to side. Dynamic hip mobility.",
    category: "warmup",
    isWarmup: true,
    muscleGroup: "glutes",
    equipment: "bodyweight"
  },
  { 
    name: "Glute Bridges", 
    sets: "2", 
    reps: "12", 
    rest: "-", 
    image: hipImg, 
    youtubeId: "8bbE64NuDTU",
    description: "Lie on back, feet flat. Squeeze glutes and raise hips. Hold at top. Great glute activation.",
    category: "warmup",
    isWarmup: true,
    muscleGroup: "glutes",
    equipment: "bodyweight"
  },
  { 
    name: "Jumping Jacks", 
    sets: "2", 
    reps: "30", 
    rest: "-", 
    image: burpeeImg, 
    youtubeId: "c4DAnQ6DtF8",
    description: "Jump feet out while raising arms overhead. Jump feet back together. Great cardio warmup.",
    category: "warmup",
    isWarmup: true,
    muscleGroup: "full",
    equipment: "bodyweight"
  },
  { 
    name: "High Knees", 
    sets: "2", 
    reps: "30s", 
    rest: "-", 
    image: burpeeImg, 
    youtubeId: "D0OjEc79P4Y",
    description: "Run in place driving knees up high. Keep core engaged and pump arms. Elevates heart rate.",
    category: "warmup",
    isWarmup: true,
    muscleGroup: "full",
    equipment: "bodyweight"
  },

  // CHEST EXERCISES (Push)
  { 
    name: "Bench Press", 
    sets: "3-4", 
    reps: "6-8", 
    rest: "3m", 
    image: ohpImg,
    youtubeId: "SCVCLChPQFY",
    description: "Lower bar to mid-chest with controlled tempo. Press up explosively. Keep shoulder blades pinched.",
    category: "push",
    muscleGroup: "chest",
    equipment: "barbell"
  },
  { 
    name: "Incline Dumbbell Press", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: ohpImg,
    youtubeId: "8iPEnn-ltC8",
    description: "Set bench to 30-45 degrees. Press dumbbells up and together. Lower with control.",
    category: "push",
    muscleGroup: "chest",
    equipment: "dumbbell"
  },
  { 
    name: "Dumbbell Flyes", 
    sets: "3", 
    reps: "12-15", 
    rest: "60s", 
    image: ohpImg,
    youtubeId: "eozdVDA78K0",
    description: "Lie flat, arms extended. Lower dumbbells in wide arc until chest stretch. Squeeze back together.",
    category: "push",
    muscleGroup: "chest",
    equipment: "dumbbell"
  },
  { 
    name: "Cable Crossover", 
    sets: "3", 
    reps: "12-15", 
    rest: "60s", 
    image: ohpImg,
    youtubeId: "taI4XduLpTk",
    description: "Set cables high. Step forward, bring hands together in arc motion. Squeeze chest at bottom.",
    category: "push",
    muscleGroup: "chest",
    equipment: "cable"
  },
  { 
    name: "Push-ups", 
    sets: "3", 
    reps: "15-20", 
    rest: "60s", 
    image: burpeeImg,
    youtubeId: "IODxDxX7oi4",
    description: "Hands shoulder width, body straight line. Lower chest to ground. Push back up explosively.",
    category: "push",
    muscleGroup: "chest",
    equipment: "bodyweight"
  },
  { 
    name: "Decline Bench Press", 
    sets: "3", 
    reps: "8-10", 
    rest: "2m", 
    image: ohpImg,
    youtubeId: "LfyQBUKR8SE",
    description: "Set bench to decline. Lower bar to lower chest. Press up with control. Targets lower chest.",
    category: "push",
    muscleGroup: "chest",
    equipment: "barbell"
  },

  // TRICEPS EXERCISES (Push)
  { 
    name: "Tricep Pushdown", 
    sets: "3", 
    reps: "12-15", 
    rest: "60s", 
    image: ohpImg,
    youtubeId: "2-LAMcpzODU",
    description: "Cable at high position. Keep elbows pinned to sides. Push down until arms fully extended.",
    category: "push",
    muscleGroup: "triceps",
    equipment: "cable"
  },
  { 
    name: "Skull Crushers", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: ohpImg,
    youtubeId: "d_KZxkY_0cM",
    description: "Lie on bench with EZ bar. Lower to forehead keeping upper arms still. Extend back up.",
    category: "push",
    muscleGroup: "triceps",
    equipment: "barbell"
  },
  { 
    name: "Overhead Tricep Extension", 
    sets: "3", 
    reps: "10-12", 
    rest: "60s", 
    image: ohpImg,
    youtubeId: "YbX7Wd8jQ-Q",
    description: "Hold dumbbell overhead with both hands. Lower behind head keeping elbows close. Extend up.",
    category: "push",
    muscleGroup: "triceps",
    equipment: "dumbbell"
  },
  { 
    name: "Close Grip Bench Press", 
    sets: "3", 
    reps: "8-10", 
    rest: "2m", 
    image: ohpImg,
    youtubeId: "nEF0bv2FW94",
    description: "Grip bar inside shoulder width. Lower to lower chest. Press up focusing on triceps.",
    category: "push",
    muscleGroup: "triceps",
    equipment: "barbell"
  },
  { 
    name: "Dips", 
    sets: "3", 
    reps: "AMRAP", 
    rest: "2m", 
    image: ohpImg,
    youtubeId: "2z8JmcrW-As",
    description: "Lower until upper arms are parallel to floor. Push up to full lockout. Keep core tight.",
    category: "push",
    muscleGroup: "triceps",
    equipment: "bodyweight"
  },
  { 
    name: "Diamond Push-ups", 
    sets: "3", 
    reps: "12-15", 
    rest: "60s", 
    image: burpeeImg,
    youtubeId: "J0DnG1_S92I",
    description: "Hands together forming diamond shape. Lower chest to hands. Push back up. Targets triceps.",
    category: "push",
    muscleGroup: "triceps",
    equipment: "bodyweight"
  },

  // SHOULDERS (Push)
  { 
    name: "Overhead Press", 
    sets: "3", 
    reps: "8-10", 
    rest: "2m", 
    image: ohpImg,
    youtubeId: "j7ULT6dznNc",
    description: "Strict press from collarbone to lockout. Keep core braced and glutes squeezed. Don't arch lower back.",
    category: "push",
    muscleGroup: "shoulders",
    equipment: "barbell"
  },
  { 
    name: "Dumbbell Shoulder Press", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: ohpImg,
    youtubeId: "qEwKCR5JCog",
    description: "Press dumbbells overhead from shoulder height. Keep core engaged throughout.",
    category: "push",
    muscleGroup: "shoulders",
    equipment: "dumbbell"
  },
  { 
    name: "Lateral Raises", 
    sets: "3", 
    reps: "12-15", 
    rest: "60s", 
    image: ohpImg,
    youtubeId: "3VcKaXpzqRo",
    description: "Raise dumbbells to side until shoulder height. Keep slight bend in elbows. Control the descent.",
    category: "push",
    muscleGroup: "shoulders",
    equipment: "dumbbell"
  },
  { 
    name: "Front Raises", 
    sets: "3", 
    reps: "12-15", 
    rest: "60s", 
    image: ohpImg,
    youtubeId: "-t7fuZ0KhDA",
    description: "Raise dumbbells in front until shoulder height. Alternate arms or do together. Control the motion.",
    category: "push",
    muscleGroup: "shoulders",
    equipment: "dumbbell"
  },

  // BACK EXERCISES (Pull)
  { 
    name: "Pull-ups", 
    sets: "3", 
    reps: "AMRAP", 
    rest: "2m", 
    image: pullupImg,
    youtubeId: "eGo4IYlbE5g",
    description: "Full range of motion. Chin over bar at top, full hang at bottom. Control the descent.",
    category: "pull",
    muscleGroup: "back",
    equipment: "bodyweight"
  },
  { 
    name: "Barbell Row", 
    sets: "3", 
    reps: "8-10", 
    rest: "2m", 
    image: pullupImg,
    youtubeId: "FWJR5Ve8bnQ",
    description: "Hinge forward at hips, pull bar to lower chest. Squeeze shoulder blades at top. Control the negative.",
    category: "pull",
    muscleGroup: "back",
    equipment: "barbell"
  },
  { 
    name: "Lat Pulldown", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: pullupImg,
    youtubeId: "CAwf7n6Luuc",
    description: "Pull bar to upper chest while squeezing lats. Control the return. Avoid using momentum.",
    category: "pull",
    muscleGroup: "back",
    equipment: "cable"
  },
  { 
    name: "Cable Row", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: pullupImg,
    youtubeId: "GZbfZ033f74",
    description: "Sit upright, pull handle to lower chest. Squeeze shoulder blades. Return with control.",
    category: "pull",
    muscleGroup: "back",
    equipment: "cable"
  },
  { 
    name: "Dumbbell Row", 
    sets: "3", 
    reps: "10-12/side", 
    rest: "60s", 
    image: pullupImg,
    youtubeId: "roCP6wCXPqo",
    description: "One hand on bench, row dumbbell to hip. Keep back flat. Squeeze at top.",
    category: "pull",
    muscleGroup: "back",
    equipment: "dumbbell"
  },
  { 
    name: "Face Pulls", 
    sets: "3", 
    reps: "15-20", 
    rest: "60s", 
    image: pullupImg,
    youtubeId: "rep-qVOkqgk",
    description: "Pull rope to face level with elbows high. Squeeze rear delts. Great for posture.",
    category: "pull",
    muscleGroup: "back",
    equipment: "cable"
  },
  { 
    name: "T-Bar Row", 
    sets: "3", 
    reps: "8-10", 
    rest: "2m", 
    image: pullupImg,
    youtubeId: "j3Igk5nyZE4",
    description: "Straddle bar, row to chest. Keep back flat and knees bent. Squeeze at top.",
    category: "pull",
    muscleGroup: "back",
    equipment: "barbell"
  },
  { 
    name: "Inverted Row", 
    sets: "3", 
    reps: "12-15", 
    rest: "60s", 
    image: pullupImg,
    youtubeId: "KOaCM1HMwU0",
    description: "Hang under bar or rings. Pull chest to bar keeping body straight. Great bodyweight back exercise.",
    category: "pull",
    muscleGroup: "back",
    equipment: "bodyweight"
  },

  // BICEPS EXERCISES (Pull)
  { 
    name: "Barbell Curl", 
    sets: "3", 
    reps: "10-12", 
    rest: "60s", 
    image: pullupImg,
    youtubeId: "kwG2ipFRgfo",
    description: "Keep elbows pinned to sides. Curl bar up squeezing biceps. Lower with control.",
    category: "pull",
    muscleGroup: "biceps",
    equipment: "barbell"
  },
  { 
    name: "Hammer Curls", 
    sets: "3", 
    reps: "12-15", 
    rest: "60s", 
    image: pullupImg,
    youtubeId: "zC3nLlEvin4",
    description: "Hold dumbbells with neutral grip. Curl up keeping palms facing in. Targets brachialis.",
    category: "pull",
    muscleGroup: "biceps",
    equipment: "dumbbell"
  },
  { 
    name: "Incline Dumbbell Curl", 
    sets: "3", 
    reps: "10-12", 
    rest: "60s", 
    image: pullupImg,
    youtubeId: "soxrZlIl35U",
    description: "Sit on incline bench, arms hanging. Curl dumbbells up. Great stretch on biceps.",
    category: "pull",
    muscleGroup: "biceps",
    equipment: "dumbbell"
  },
  { 
    name: "Preacher Curl", 
    sets: "3", 
    reps: "10-12", 
    rest: "60s", 
    image: pullupImg,
    youtubeId: "vngli9UR6Hw",
    description: "Rest arms on preacher pad. Curl weight up squeezing biceps. Lower with control.",
    category: "pull",
    muscleGroup: "biceps",
    equipment: "barbell"
  },

  // LEGS - QUADS
  { 
    name: "Barbell Squat", 
    sets: "3-4", 
    reps: "6-8", 
    rest: "3m", 
    image: squatImg, 
    youtubeId: "R2dMsNhN3DE",
    description: "Keep chest up, core tight. Break at hips and knees simultaneously. Drive through mid-foot.",
    category: "legs",
    muscleGroup: "quads",
    equipment: "barbell"
  },
  { 
    name: "Leg Press", 
    sets: "3", 
    reps: "10-12", 
    rest: "2m", 
    image: squatImg,
    youtubeId: "IZxyjW7MPJQ",
    description: "Place feet shoulder-width on platform. Lower until thighs are parallel. Push through heels.",
    category: "legs",
    muscleGroup: "quads",
    equipment: "machine"
  },
  { 
    name: "Dumbbell Lunges", 
    sets: "3", 
    reps: "10/side", 
    rest: "90s", 
    image: squatImg,
    youtubeId: "D7KaRcUTQeE",
    description: "Step forward, lower back knee toward floor. Keep torso upright. Drive through front heel.",
    category: "legs",
    muscleGroup: "quads",
    equipment: "dumbbell"
  },
  { 
    name: "Bulgarian Split Squat", 
    sets: "3", 
    reps: "8/side", 
    rest: "90s", 
    image: squatImg,
    youtubeId: "2C-uNgKwPLE",
    description: "Rear foot elevated on bench. Lower until front thigh is parallel. Push through front heel.",
    category: "legs",
    muscleGroup: "quads",
    equipment: "dumbbell"
  },
  { 
    name: "Leg Extension", 
    sets: "3", 
    reps: "12-15", 
    rest: "60s", 
    image: squatImg,
    youtubeId: "YyvSfVjQeL0",
    description: "Sit in machine, extend legs until straight. Squeeze quads at top. Lower with control.",
    category: "legs",
    muscleGroup: "quads",
    equipment: "machine"
  },
  { 
    name: "Goblet Squat", 
    sets: "3", 
    reps: "12-15", 
    rest: "90s", 
    image: squatImg,
    youtubeId: "MeIiIdhvXT4",
    description: "Hold dumbbell at chest. Squat deep keeping torso upright. Great for mobility and quads.",
    category: "legs",
    muscleGroup: "quads",
    equipment: "dumbbell"
  },
  { 
    name: "Bodyweight Squat", 
    sets: "3", 
    reps: "20", 
    rest: "60s", 
    image: squatImg,
    youtubeId: "aclHkVaku9U",
    description: "Feet shoulder width, squat down keeping chest up. Push through heels. Great warmup or finisher.",
    category: "legs",
    muscleGroup: "quads",
    equipment: "bodyweight"
  },
  { 
    name: "Step-ups", 
    sets: "3", 
    reps: "12/side", 
    rest: "60s", 
    image: squatImg,
    youtubeId: "WCFCdxzFBa4",
    description: "Step onto bench or box. Drive through heel to stand tall. Step down with control.",
    category: "legs",
    muscleGroup: "quads",
    equipment: "bodyweight"
  },

  // LEGS - HAMSTRINGS/GLUTES
  { 
    name: "Romanian Deadlift", 
    sets: "3", 
    reps: "8-10", 
    rest: "2m", 
    image: rdlImg,
    youtubeId: "JCXUYuzwNrM",
    description: "Hinge at the hips, keeping legs slightly bent. Lower bar while keeping it close to shins. Feel the stretch in hamstrings.",
    category: "legs",
    muscleGroup: "hamstrings",
    equipment: "barbell"
  },
  { 
    name: "Deadlift", 
    sets: "3-4", 
    reps: "5-6", 
    rest: "3m", 
    image: rdlImg,
    youtubeId: "op9kVnSso6Q",
    description: "Hinge at hips, keep back flat. Drive through heels. Lockout with glutes, not lower back.",
    category: "legs",
    muscleGroup: "hamstrings",
    equipment: "barbell"
  },
  { 
    name: "Dumbbell RDL", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: rdlImg,
    youtubeId: "cYKYGwcg0U8",
    description: "Hold dumbbells, hinge at hips keeping back flat. Great alternative when no barbell available.",
    category: "legs",
    muscleGroup: "hamstrings",
    equipment: "dumbbell"
  },
  { 
    name: "Leg Curl", 
    sets: "3", 
    reps: "12-15", 
    rest: "60s", 
    image: rdlImg,
    youtubeId: "1Tq3QdYUuHs",
    description: "Lie face down on machine. Curl heels toward glutes. Squeeze hamstrings at top.",
    category: "legs",
    muscleGroup: "hamstrings",
    equipment: "machine"
  },
  { 
    name: "Hip Thrust", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: hipImg,
    youtubeId: "SEdqd1n0cvg",
    description: "Upper back on bench, barbell on hips. Drive hips up squeezing glutes. Lower with control.",
    category: "legs",
    muscleGroup: "glutes",
    equipment: "barbell"
  },
  { 
    name: "Good Morning", 
    sets: "3", 
    reps: "10-12", 
    rest: "90s", 
    image: rdlImg,
    youtubeId: "vKPGe8zb2S4",
    description: "Bar on upper back. Hinge at hips keeping back flat. Feel stretch in hamstrings. Return to start.",
    category: "legs",
    muscleGroup: "hamstrings",
    equipment: "barbell"
  },
  { 
    name: "Single Leg RDL", 
    sets: "3", 
    reps: "10/side", 
    rest: "60s", 
    image: rdlImg,
    youtubeId: "95_IDQIV3LM",
    description: "Stand on one leg, hinge forward with other leg extending back. Great balance and hamstring work.",
    category: "legs",
    muscleGroup: "hamstrings",
    equipment: "bodyweight"
  },
  { 
    name: "Glute Bridge", 
    sets: "3", 
    reps: "15", 
    rest: "60s", 
    image: hipImg,
    youtubeId: "8bbE64NuDTU",
    description: "Lie on back, feet flat. Squeeze glutes and raise hips. Hold at top. Great glute activation.",
    category: "legs",
    muscleGroup: "glutes",
    equipment: "bodyweight"
  },

  // CORE/ABS EXERCISES
  { 
    name: "Plank", 
    sets: "3", 
    reps: "60s", 
    rest: "30s", 
    image: burpeeImg,
    youtubeId: "ASdvN_XEl_c",
    description: "Forearms and toes on ground. Keep body in straight line. Engage core throughout.",
    category: "core",
    muscleGroup: "abs",
    equipment: "bodyweight"
  },
  { 
    name: "Dead Bug", 
    sets: "3", 
    reps: "10/side", 
    rest: "30s", 
    image: hipImg,
    youtubeId: "I5xbsA71v1A",
    description: "Lie on back, extend opposite arm and leg. Keep lower back pressed to floor.",
    category: "core",
    muscleGroup: "abs",
    equipment: "bodyweight"
  },
  { 
    name: "Hanging Leg Raise", 
    sets: "3", 
    reps: "10-12", 
    rest: "60s", 
    image: pullupImg,
    youtubeId: "Pr1ieGZ5atk",
    description: "Hang from bar. Raise legs until parallel or higher. Control the descent. Targets lower abs.",
    category: "core",
    muscleGroup: "abs",
    equipment: "bodyweight"
  },
  { 
    name: "Cable Crunch", 
    sets: "3", 
    reps: "15-20", 
    rest: "45s", 
    image: burpeeImg,
    youtubeId: "ToJeyhydUxU",
    description: "Kneel at cable with rope behind head. Crunch down bringing elbows to knees. Squeeze abs.",
    category: "core",
    muscleGroup: "abs",
    equipment: "cable"
  },
  { 
    name: "Russian Twist", 
    sets: "3", 
    reps: "20", 
    rest: "45s", 
    image: burpeeImg,
    youtubeId: "wkD8rjkodUI",
    description: "Sit with knees bent, lean back slightly. Rotate torso side to side. Targets obliques.",
    category: "core",
    muscleGroup: "abs",
    equipment: "bodyweight"
  },
  { 
    name: "Ab Wheel Rollout", 
    sets: "3", 
    reps: "10-12", 
    rest: "60s", 
    image: burpeeImg,
    youtubeId: "rqiTPdK1c_I",
    description: "Kneel with wheel in front. Roll out keeping core tight. Roll back to start. Don't let hips sag.",
    category: "core",
    muscleGroup: "abs",
    equipment: "machine"
  },
  { 
    name: "Bicycle Crunch", 
    sets: "3", 
    reps: "20/side", 
    rest: "45s", 
    image: burpeeImg,
    youtubeId: "9FGilxCbdz8",
    description: "Lie on back, hands behind head. Bring elbow to opposite knee alternating sides. Keep pedaling.",
    category: "core",
    muscleGroup: "abs",
    equipment: "bodyweight"
  },
  { 
    name: "Pallof Press", 
    sets: "3", 
    reps: "12/side", 
    rest: "45s", 
    image: burpeeImg,
    youtubeId: "AH_QZLm_0-s",
    description: "Stand sideways to cable. Press handle straight out resisting rotation. Great anti-rotation exercise.",
    category: "core",
    muscleGroup: "abs",
    equipment: "cable"
  },
  { 
    name: "Leg Raises", 
    sets: "3", 
    reps: "15", 
    rest: "45s", 
    image: burpeeImg,
    youtubeId: "JB2oyawG9KI",
    description: "Lie flat, raise legs to 90 degrees. Lower with control. Keep lower back pressed down.",
    category: "core",
    muscleGroup: "abs",
    equipment: "bodyweight"
  },
  { 
    name: "V-Ups", 
    sets: "3", 
    reps: "12", 
    rest: "45s", 
    image: burpeeImg,
    youtubeId: "iP2fjvG0g3w",
    description: "Lie flat, simultaneously raise legs and torso to form V shape. Touch toes at top.",
    category: "core",
    muscleGroup: "abs",
    equipment: "bodyweight"
  },

  // CARDIO EXERCISES
  { 
    name: "Row Erg Intervals", 
    sets: "10", 
    reps: "500m", 
    rest: "1:1", 
    image: rowImg,
    youtubeId: "zQ82RYIFLN8",
    description: "Drive with legs, then swing body, then pull arms. Reverse on recovery. Maintain consistent stroke rate.",
    isCardio: true,
    category: "cardio",
    muscleGroup: "full",
    equipment: "cardio_machine"
  },
  { 
    name: "Kettlebell Swings", 
    sets: "5", 
    reps: "20", 
    rest: "1m", 
    image: swingImg,
    youtubeId: "YSxHifyI6s8",
    description: "Explosive hip hinge. Snap hips forward to propel bell. Arms act as ropes, not movers.",
    category: "cardio",
    muscleGroup: "full",
    equipment: "kettlebell"
  },
  { 
    name: "Box Jumps", 
    sets: "4", 
    reps: "12", 
    rest: "90s", 
    image: boxJumpImg,
    youtubeId: "52r_Ul5k03g",
    description: "Soft landing. Stand tall at top. Step down, do not rebound jump unless advanced.",
    category: "cardio",
    muscleGroup: "full",
    equipment: "bodyweight"
  },
  { 
    name: "Burpees", 
    sets: "3", 
    reps: "15", 
    rest: "60s", 
    image: burpeeImg,
    youtubeId: "dZgVxmf6jkA",
    description: "Chest to floor. Explosive jump up. Clap behind head. Maintain pace.",
    category: "cardio",
    muscleGroup: "full",
    equipment: "bodyweight"
  },
  { 
    name: "Battle Ropes", 
    sets: "4", 
    reps: "30s", 
    rest: "30s", 
    image: swingImg,
    youtubeId: "oF9PN-HBB_Y",
    description: "Alternate arms in wave pattern. Keep core braced. Maintain consistent rhythm.",
    category: "cardio",
    muscleGroup: "full",
    equipment: "cable"
  },
  { 
    name: "Mountain Climbers", 
    sets: "4", 
    reps: "30s", 
    rest: "30s", 
    image: burpeeImg,
    youtubeId: "nmwgirgXLYM",
    description: "High plank position. Alternate driving knees to chest. Keep hips low and stable.",
    category: "cardio",
    muscleGroup: "full",
    equipment: "bodyweight"
  },
  { 
    name: "Incline Treadmill Walk", 
    sets: "1", 
    reps: "15-20 min", 
    rest: "-", 
    image: rowImg,
    youtubeId: "ykH9cKIjXQ0",
    description: "Set incline to 10-15%. Walk at moderate pace. Great low-impact cardio finisher.",
    isCardio: true,
    category: "cardio",
    muscleGroup: "full",
    equipment: "cardio_machine"
  },
  { 
    name: "Assault Bike Intervals", 
    sets: "8", 
    reps: "20s on/40s off", 
    rest: "40s", 
    image: rowImg,
    youtubeId: "nPkHIVEx2x0",
    description: "Max effort for 20 seconds, recover for 40 seconds. Full body conditioning.",
    isCardio: true,
    category: "cardio",
    muscleGroup: "full",
    equipment: "cardio_machine"
  },
  { 
    name: "Jump Squats", 
    sets: "4", 
    reps: "15", 
    rest: "60s", 
    image: squatImg,
    youtubeId: "A-cFYWvaHr0",
    description: "Squat down then explosively jump up. Land softly and immediately go into next rep.",
    category: "cardio",
    muscleGroup: "full",
    equipment: "bodyweight"
  },
  { 
    name: "Jumping Lunges", 
    sets: "4", 
    reps: "20", 
    rest: "60s", 
    image: squatImg,
    youtubeId: "y7Iug7eC0dk",
    description: "Lunge position, jump and switch legs mid-air. Land softly with control.",
    category: "cardio",
    muscleGroup: "full",
    equipment: "bodyweight"
  },

  // MOBILITY EXERCISES
  { 
    name: "Thoracic Rotation", 
    sets: "2", 
    reps: "10/side", 
    rest: "-", 
    image: thoracicImg,
    youtubeId: "SB5gsT6X5Vk",
    description: "Open up the chest and upper back. Follow hand with eyes. Breathe into the stretch.",
    category: "mobility",
    muscleGroup: "back",
    equipment: "bodyweight"
  },
  { 
    name: "Hip 90/90", 
    sets: "2", 
    reps: "60s/side", 
    rest: "-", 
    image: hipImg,
    youtubeId: "8p6FtlqpAYg",
    description: "Front leg at 90 degrees, back leg at 90 degrees. Lean forward with flat back for external rotation stretch.",
    category: "mobility",
    muscleGroup: "glutes",
    equipment: "bodyweight"
  },
  { 
    name: "Ankle Dorsiflexion", 
    sets: "2", 
    reps: "15/side", 
    rest: "-", 
    image: ankleImg,
    youtubeId: "IikP_teeLkI",
    description: "Drive knee over toe while keeping heel planted. Use bodyweight or weight to increase range.",
    category: "mobility",
    muscleGroup: "quads",
    equipment: "bodyweight"
  },
  { 
    name: "World's Greatest Stretch", 
    sets: "2", 
    reps: "5/side", 
    rest: "-", 
    image: hipImg,
    youtubeId: "u-8d9IIeaXA",
    description: "Lunge position, rotate torso toward front leg. Reach arm overhead. Great full-body mobility.",
    category: "mobility",
    equipment: "bodyweight",
    muscleGroup: "full"
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

export function getExercisesByMuscleGroup(muscleGroup: string): ExerciseDef[] {
  return EXERCISE_DATABASE.filter(ex => ex.muscleGroup === muscleGroup);
}

export function getWarmupExercises(): ExerciseDef[] {
  return EXERCISE_DATABASE.filter(ex => ex.category === "warmup");
}

export function getCoreExercises(): ExerciseDef[] {
  return EXERCISE_DATABASE.filter(ex => ex.category === "core");
}

export function getCardioFinishers(): ExerciseDef[] {
  return EXERCISE_DATABASE.filter(ex => ex.category === "cardio" && !ex.isWarmup);
}

export type EquipmentFilter = "Full Gym" | "Dumbbells Only" | "Bodyweight";

export function filterByEquipment(exercises: ExerciseDef[], equipment: EquipmentFilter): ExerciseDef[] {
  if (equipment === "Full Gym") {
    return exercises;
  }
  if (equipment === "Dumbbells Only") {
    return exercises.filter(ex => 
      !ex.equipment || 
      ex.equipment === "dumbbell" || 
      ex.equipment === "bodyweight" ||
      ex.equipment === "kettlebell"
    );
  }
  if (equipment === "Bodyweight") {
    return exercises.filter(ex => 
      !ex.equipment || 
      ex.equipment === "bodyweight"
    );
  }
  return exercises;
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
