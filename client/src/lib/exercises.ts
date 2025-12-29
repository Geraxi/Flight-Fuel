
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
  videoUrl?: string;
  description: string;
  isCardio?: boolean;
}

export const MOCK_EXERCISES: Record<string, ExerciseDef[]> = {
  strength: [
    { 
      name: "Barbell Squat", 
      sets: "3-4", 
      reps: "6-8", 
      rest: "3m", 
      image: squatImg, 
      videoUrl: "https://www.muscleandstrength.com/exercises/squat.html",
      description: "Keep chest up, core tight. Break at hips and knees simultaneously. Drive through mid-foot."
    },
    { 
      name: "Romanian Deadlift", 
      sets: "3", 
      reps: "8-10", 
      rest: "2m", 
      image: rdlImg,
      videoUrl: "https://www.muscleandstrength.com/exercises/romanian-deadlift.html",
      description: "Hinge at the hips, keeping legs slightly bent. Lower bar while keeping it close to shins. Feel the stretch in hamstrings."
    },
    { 
      name: "Overhead Press", 
      sets: "3", 
      reps: "8-10", 
      rest: "2m", 
      image: ohpImg,
      videoUrl: "https://www.muscleandstrength.com/exercises/military-press.html",
      description: "Strict press from collarbone to lockout. Keep core braced and glutes squeezed. Don't arch lower back."
    },
    { 
      name: "Pull-ups (Weighted)", 
      sets: "3", 
      reps: "AMRAP", 
      rest: "2m", 
      image: pullupImg,
      videoUrl: "https://www.muscleandstrength.com/exercises/pull-up.html",
      description: "Full range of motion. Chin over bar at top, full hang at bottom. Control the descent."
    },
  ],
  conditioning: [
    { 
      name: "Row Erg Intervals", 
      sets: "10", 
      reps: "500m", 
      rest: "1:1", 
      image: rowImg,
      videoUrl: "https://www.muscleandstrength.com/exercises/rowing-machine.html",
      description: "Drive with legs, then swing body, then pull arms. Reverse on recovery. Maintain consistent stroke rate.",
      isCardio: true
    },
    { 
      name: "Kettlebell Swings", 
      sets: "5", 
      reps: "20", 
      rest: "1m", 
      image: swingImg,
      videoUrl: "https://www.muscleandstrength.com/exercises/kettlebell-swing",
      description: "Explosive hip hinge. Snap hips forward to propel bell. Arms act as ropes, not movers."
    },
    { 
      name: "Box Jumps", 
      sets: "4", 
      reps: "12", 
      rest: "90s", 
      image: boxJumpImg,
      videoUrl: "https://www.muscleandstrength.com/exercises/box-jump.html",
      description: "Soft landing. Stand tall at top. Step down, do not rebound jump unless advanced."
    },
    { 
      name: "Burpees", 
      sets: "3", 
      reps: "15", 
      rest: "60s", 
      image: burpeeImg,
      videoUrl: "https://www.muscleandstrength.com/exercises/burpee.html",
      description: "Chest to floor. Explosive jump up. Clap behind head. Maintain pace."
    },
  ],
  mobility: [
    { 
      name: "Thoracic Rotation", 
      sets: "2", 
      reps: "10/side", 
      rest: "-", 
      image: thoracicImg,
      videoUrl: "https://www.muscleandstrength.com/exercises/lying-thoracic-rotation",
      description: "Open up the chest and upper back. Follow hand with eyes. Breathe into the stretch."
    },
    { 
      name: "Hip 90/90", 
      sets: "2", 
      reps: "60s/side", 
      rest: "-", 
      image: hipImg,
      videoUrl: "https://www.muscleandstrength.com/exercises/90-90-stretch.html",
      description: "Front leg at 90 degrees, back leg at 90 degrees. Lean forward with flat back for external rotation stretch."
    },
    { 
      name: "Ankle Dorsiflexion", 
      sets: "2", 
      reps: "15/side", 
      rest: "-", 
      image: ankleImg,
      videoUrl: "https://www.muscleandstrength.com/exercises/wall-ankle-dorsiflexion.html",
      description: "Drive knee over toe while keeping heel planted. Use bodyweight or weight to increase range."
    },
  ]
};

export const ALTERNATIVES: Record<string, string[]> = {
  "Barbell Squat": ["Goblet Squat", "Leg Press", "Bulgarian Split Squat"],
  "Romanian Deadlift": ["Hamstring Curl", "Kettlebell Swing", "Good Morning"],
  "Overhead Press": ["Dumbbell Press", "Landmine Press", "Push-ups"],
  "Pull-ups (Weighted)": ["Lat Pulldown", "Inverted Row", "Dumbbell Row"],
  "Row Erg Intervals": ["Air Bike", "Treadmill Sprints", "Jump Rope"],
  "Kettlebell Swings": ["Broad Jumps", "Clean & Press", "Medicine Ball Slams"],
  "Box Jumps": ["Step-ups", "Jump Squats", "Tuck Jumps"],
  "Burpees": ["Mountain Climbers", "Thrusters", "Bear Crawls"],
  "Thoracic Rotation": ["Cat-Cow", "Open Book", "Thread the Needle"],
  "Hip 90/90": ["Pigeon Pose", "Frog Stretch", "Couch Stretch"],
  "Ankle Dorsiflexion": ["Calf Stretch", "Down Dog", "Tibialis Raise"]
};
