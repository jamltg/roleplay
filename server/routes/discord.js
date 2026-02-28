import { Router } from 'express';
const router = Router();

router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await req.client.users.fetch(userId); 
    res.json({
      username: user.username,
      avatarURL: user.displayAvatarURL()
    });
  } catch (err) {
    res.status(500).json({ error: 'User not found' });
  }
});

export default router;