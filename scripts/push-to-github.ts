import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

// GitHub connection integration
let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function main() {
  console.log('Getting GitHub client...');
  const octokit = await getUncachableGitHubClient();
  
  // Get authenticated user
  const { data: user } = await octokit.users.getAuthenticated();
  console.log(`Authenticated as: ${user.login}`);
  
  const repoName = 'flightfuel-app';
  
  // Check if repo exists
  let repoExists = false;
  try {
    await octokit.repos.get({
      owner: user.login,
      repo: repoName
    });
    repoExists = true;
    console.log(`Repository ${repoName} already exists.`);
  } catch (e: any) {
    if (e.status === 404) {
      console.log(`Creating new repository: ${repoName}`);
    } else {
      throw e;
    }
  }
  
  // Create repo if it doesn't exist
  if (!repoExists) {
    await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: 'FlightFuel - Aviation-themed nutrition, hydration, and training app for pilots',
      private: false,
      auto_init: false
    });
    console.log(`Repository created: https://github.com/${user.login}/${repoName}`);
  }
  
  // Get access token for git operations
  const accessToken = await getAccessToken();
  
  // Configure git remote
  const remoteUrl = `https://${accessToken}@github.com/${user.login}/${repoName}.git`;
  
  try {
    // Remove existing remote if it exists
    execSync('git remote remove origin 2>/dev/null || true', { stdio: 'pipe' });
    
    // Add the new remote
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'pipe' });
    console.log('Git remote configured.');
    
    // Stage all files
    execSync('git add -A', { stdio: 'inherit' });
    
    // Create a commit
    try {
      execSync('git commit -m "Initial commit: FlightFuel app"', { stdio: 'inherit' });
    } catch (e) {
      console.log('No new changes to commit (already committed).');
    }
    
    // Push to GitHub
    console.log('Pushing to GitHub...');
    execSync('git push -u origin main --force', { stdio: 'inherit' });
    
    console.log(`\n✅ Success! Your code is now on GitHub:`);
    console.log(`   https://github.com/${user.login}/${repoName}`);
    console.log(`\nYou can now import this into Google Antigravity to build a native iOS app.`);
    
  } catch (error) {
    console.error('Error during git operations:', error);
    throw error;
  }
}

main().catch(console.error);
